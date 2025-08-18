import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import sanitizeHtml from 'sanitize-html';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from './models/index.js';
import Post from './models/post.model.js';
import { setupSwagger } from './swagger.js';

dotenv.config();

// Initialize / sync Sequelize models
if (process.env.NODE_ENV !== 'test') {
  db.sync();
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security headers
app.use(helmet());
// Body parsing with basic size limit (must come BEFORE sanitization)
app.use(express.json({ limit: '100kb' }));
// multipart handled by multer per route; no global body parser for that needed
// Rich text sanitization middleware
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string') {
        const value = req.body[key].trim();
        if (['content', 'bio'].includes(key)) {
          req.body[key] = sanitizeHtml(value, {
            allowedTags: ['p','b','i','em','strong','a','ul','ol','li','blockquote','code','pre','h1','h2','h3','h4','h5','h6','br','hr','img'],
            allowedAttributes: { a: ['href','name','target','rel'], img: ['src','alt','title'], '*': ['class'] },
            allowedSchemes: ['http','https','mailto'],
            transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) }
          });
        } else {
          req.body[key] = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
        }
      }
    }
  }
  next();
});
app.use(cookieParser());

// Environment sanity check (helps diagnose 500 on signup due to missing secrets)
['JWT_SECRET'].forEach(varName => {
  if (!process.env[varName]) {
    console.warn(`[warn] Required env var ${varName} is missing. Auth token generation may fail.`);
  }
});

// Simple request logging (could be replaced with morgan later)
app.use((req, _res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`${req.method} ${req.originalUrl}`);
  }
  next();
});

// Only start server if not required by tests
if (process.env.NODE_ENV !== 'test') {
  const basePort = parseInt(process.env.PORT, 10) || 3001;
  let currentPort = basePort;
  const start = (retry = false) => {
    const server = app.listen(currentPort, () => {
      console.log(`Server is running on port ${currentPort}!`);
      if (retry) {
        console.log(`[info] Previously requested port ${basePort} was busy; using fallback ${currentPort}. Set PORT env to change.`);
      }
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        if (!retry) {
          console.warn(`[warn] Port ${currentPort} in use. Trying ${currentPort + 1}...`);
          currentPort += 1;
          start(true);
        } else {
          console.error('[fatal] Fallback port also in use. Free a port or set PORT env var.');
          process.exit(1);
        }
      } else {
        console.error('[fatal] Server error:', err);
        process.exit(1);
      }
    });
  };
  start();
}

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
// Basic health endpoint
app.get('/api/health', async (_req, res) => {
  try {
    await db.sequelize.authenticate();
    res.json({ status: 'ok', db: true });
  } catch (e) {
    res.status(503).json({ status: 'degraded', db: false, error: e.message });
  }
});
// Swagger docs
setupSwagger(app);

// Serve built frontend only if it exists (prevents ENOENT in dev before build)
const distDir = path.join(__dirname, '../client/dist');
// Static uploads (public)
const uploadsDir = path.join(process.cwd(), 'uploads');
if (fs.existsSync(uploadsDir)) {
  app.use('/uploads', express.static(uploadsDir));
}
const hasClientBuild = fs.existsSync(distDir);
if (hasClientBuild) {
  app.use(express.static(distDir));
} else {
  console.warn(`Client build not found at ${distDir}. Run "npm run build --prefix client" to generate it.`);
}

// Basic robots.txt referencing XML sitemap
app.get('/robots.txt', (_req, res) => {
  res
    .type('text/plain')
    .send('User-agent: *\nAllow: /\nSitemap: /sitemap.xml');
});

// Dynamic sitemap (XML) including post slugs
app.get('/sitemap.xml', async (_req, res) => {
  try {
    const base = process.env.APP_BASE_URL || 'http://localhost:3001';
    const staticPaths = ['/', '/about', '/projects', '/explore-topics', '/search'];
    const posts = await Post.findAll({ attributes: ['slug'], limit: 500 });
    const urls = [
      ...staticPaths.map(p => `<url><loc>${base}${p}</loc></url>`),
      ...posts.map(p => `<url><loc>${base}/post/${p.slug}</loc></url>`)
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
    res.type('application/xml').send(xml);
  } catch (e) {
    res.status(500).type('text/plain').send('sitemap generation error');
  }
});

if (hasClientBuild) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// Global error handler
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'test') {
    console.error('[error][handler]', {
      path: req.originalUrl,
      method: req.method,
      statusCode,
      name: err.name,
      message: err.message,
    });
  }
  const payload = {
    success: false,
    statusCode,
    message,
  };
  if (process.env.NODE_ENV !== 'production') {
    payload.name = err.name;
    if (err.errors) {
      payload.errors = err.errors.map(e => ({ message: e.message, path: e.path }));
    }
  }
  res.status(statusCode).json(payload);
});


export default app;