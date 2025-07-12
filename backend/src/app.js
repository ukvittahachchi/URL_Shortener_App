import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { apiLimiter, authLimiter } from './middleware/rateLimit.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Apply rate limiting
// General API limiter (100 requests per 15 minutes)
app.use(apiLimiter);

// Stricter limiter for auth routes (20 requests per 15 minutes)
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/url', urlRoutes);
app.use('/api/auth', authRoutes);

// Health check (exclude from rate limiting)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

export default app;