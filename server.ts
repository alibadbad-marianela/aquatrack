import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import { apiRouter } from './server/routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
// Must strictly run on port 3000 behind nginx reverse proxy
const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use('/api', apiRouter);

async function startServer() {
  if (!isProd) {
    // In development mode, mount Vite dev server as middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built static assets from dist
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AquaTrack] Server running on http://0.0.0.0:${PORT} (${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('[AquaTrack] Failed to start server:', err);
  process.exit(1);
});
