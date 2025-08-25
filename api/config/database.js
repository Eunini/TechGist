import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve and load .env (search a few candidate locations to avoid cwd issues)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const candidateEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
];
let loadedEnvPath = null;
for (const p of candidateEnvPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    loadedEnvPath = p;
    break;
  }
}
if (!loadedEnvPath) {
  console.warn('[warn] No .env file found in candidate paths:', candidateEnvPaths.join(', '));
} else {
  if (process.env.DEBUG_ENV === 'true') {
    console.log('[env] Loaded .env from', loadedEnvPath);
  }
}

// Support single DATABASE_URL if provided
const { DATABASE_URL } = process.env;

let {
  DB_NAME = 'techgist_db',
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_HOST = '127.0.0.1',
  DB_PORT = '5432'
} = process.env;

// Ensure password is a string for pg (SASL requires string)
if (DB_PASSWORD !== undefined && DB_PASSWORD !== null) {
  DB_PASSWORD = String(DB_PASSWORD);
}

if (!DB_PASSWORD) {
  console.warn('[warn] DB_PASSWORD is empty (resolved value length: ' + (DB_PASSWORD ? DB_PASSWORD.length : 0) + ').');
}
if (typeof DB_PASSWORD !== 'string') {
  console.warn('[warn] DB_PASSWORD is not a string. Type:', typeof DB_PASSWORD);
}
if (!process.env.JWT_SECRET) {
  console.warn('[warn] JWT_SECRET missing. Set it in .env for auth to work.');
}
// Fallback diagnostic: try to detect hidden characters / BOM if critical vars missing
if ((!process.env.JWT_SECRET || !DB_PASSWORD) && loadedEnvPath) {
  try {
    const raw = fs.readFileSync(loadedEnvPath, 'utf8');
    const lines = raw.split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
    const parsedKeys = lines.map(l => l.split('=')[0].replace(/^\uFEFF/, '')).filter(Boolean);
    console.log('[env][diagnostic] Parsed keys from file:', parsedKeys);
    // Detect potential UTF-16 / BOM / null-byte encoding issues
    const stat = fs.statSync(loadedEnvPath);
    const hasNulls = raw.includes('\u0000');
    console.log('[env][diagnostic] env file size bytes:', stat.size, 'hasNulls:', hasNulls, 'rawLength:', raw.length);
    if (hasNulls) {
      console.warn('[env][hint] Detected null bytes; file may be saved in UTF-16. Re-save .env as UTF-8 (no BOM).');
    } else if (stat.size > 0 && parsedKeys.length === 0) {
      console.warn('[env][hint] Non-empty file but no parsable lines. Check for non-ASCII characters or smart quotes.');
    }
    const jwtKey = parsedKeys.find(k => k.toUpperCase() === 'JWT_SECRET');
    const pwdKey = parsedKeys.find(k => k.toUpperCase() === 'DB_PASSWORD');
    if (jwtKey && jwtKey !== 'JWT_SECRET') {
      console.warn(`[env][hint] Found key '${jwtKey}' that looks like JWT_SECRET but has casing/characters. Rename to JWT_SECRET.`);
    }
    if (pwdKey && pwdKey !== 'DB_PASSWORD') {
      console.warn(`[env][hint] Found key '${pwdKey}' that looks like DB_PASSWORD but has casing/characters. Rename to DB_PASSWORD.`);
    }
  } catch (e) {
    console.warn('[env][diagnostic] Failed to re-read .env for diagnostics:', e.message);
  }
}
if (process.env.DEBUG_ENV === 'true') {
  const dbg = {
    DB_NAME,
    DB_USER,
    DB_HOST,
    DB_PORT,
    DB_PASSWORD_type: typeof DB_PASSWORD,
    DB_PASSWORD_length: DB_PASSWORD ? DB_PASSWORD.length : 0,
    JWT_SECRET_present: !!process.env.JWT_SECRET,
  };
  console.log('[env] Debug snapshot:', dbg);
}

const dbConfig = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false,
};

// **Render-ready Sequelize instantiation with SSL**
const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      logging: false,
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // required for Render Postgres
        },
      },
    })
  : new Sequelize(dbConfig);

export const development = dbConfig;
export const test = { ...dbConfig, database: 'techgist_db_test' };
export const production = { use_env_variable: 'DATABASE_URL', dialect: 'postgres' };

export default sequelize;