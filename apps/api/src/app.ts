import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { routes } from './routes.js';

export const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.WEB_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static('uploads'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

app.use('/api', routes);

app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});