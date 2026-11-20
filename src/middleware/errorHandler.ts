import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';
import type { ApiResponse } from '../types/index.js';

// Custom application error with status code
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Central error handler middleware — must have 4 params for Express to treat it as error handler
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error (never expose stack traces or secrets to the client)
  if (err instanceof AppError && err.isOperational) {
    logger.warn(`Operational error: ${err.message}`);
  } else {
    logger.error('Unexpected error:', err);
  }

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Build a safe response — never leak internal details
  const response: ApiResponse = {
    success: false,
    message:
      statusCode === 500
        ? 'An internal server error occurred'
        : err.message,
  };

  res.status(statusCode).json(response);
}
