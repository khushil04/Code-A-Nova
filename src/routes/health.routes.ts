import { Router, type Request, type Response } from 'express';
import { prisma } from '../config/database.js';

export const healthRouter = Router();

// GET /api/health — basic liveness check
healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'SecureVault API is running',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
  });
});

// GET /api/health/ready — readiness check (includes DB connectivity)
healthRouter.get('/ready', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: 'Service is ready',
      data: {
        status: 'ready',
        database: 'connected',
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    res.status(503).json({
      success: false,
      message: 'Service is not ready',
      data: {
        status: 'not ready',
        database: 'disconnected',
        timestamp: new Date().toISOString(),
      },
    });
  }
});
