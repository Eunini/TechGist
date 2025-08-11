import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Allow configuring backend port via VITE_API_PORT (defined in client/.env)
const apiPort = process.env.VITE_API_PORT || 3001;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (_proxyReq, req) => {
            if (process.env.VITE_DEBUG_PROXY === 'true') {
              console.log(`[proxy:req] -> ${apiPort} ${req.method} ${req.url}`);
            }
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            if (process.env.VITE_DEBUG_PROXY === 'true') {
              console.log(`[proxy:res] <- ${apiPort} ${req.method} ${req.url} ${proxyRes.statusCode}`);
            }
          });
          proxy.on('error', (err, _req, _res) => {
            console.error(`[proxy:error] target http://localhost:${apiPort} ${err.code || err.message}`);
          });
        }
      }
      ,'/uploads': {
        target: `http://localhost:${apiPort}`,
        changeOrigin: true,
        secure: false
      }
    },
  },
  plugins: [react()],
});
