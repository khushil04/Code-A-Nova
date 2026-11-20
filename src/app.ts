import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.routes.js';
import { logger } from './config/logger.js';

const app = express();

// --- Security middleware ---
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// --- Global rate limiter ---
app.use(
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests, please try again later.',
    },
  })
);

// --- Body parsers ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Request logging ---
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// --- Routes ---
app.use('/api/health', healthRouter);
// Future routes will be registered here:
// app.use('/api/auth', authRouter);
// app.use('/api/credentials', credentialRouter);
// app.use('/api/categories', categoryRouter);
// app.use('/api/admin', adminRouter);

// --- Swagger docs (registered in a later stage) ---
// app.use('/api/docs', swaggerRouter);

// --- Central error handler (must be last) ---
app.use(errorHandler);

export default app;
