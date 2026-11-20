import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format — never expose secrets
const logFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} [${level}]: ${stack || message}${metaStr}`;
});

// Determine log level from environment
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';

export const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  defaultMeta: { service: 'securevault' },
  transports: [
    // Console transport — colorized in development
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      ),
    }),

    // File transports — structured JSON for production log aggregation
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../logs/error.log'),
      level: 'error',
      format: combine(timestamp(), winston.format.json()),
      maxsize: 5_242_880, // 5 MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.resolve(__dirname, '../../logs/combined.log'),
      format: combine(timestamp(), winston.format.json()),
      maxsize: 5_242_880,
      maxFiles: 5,
    }),
  ],

  // Don't exit on unhandled errors in the logger itself
  exitOnError: false,
});

// In test environment, silence logs to keep test output clean
if (process.env.NODE_ENV === 'test') {
  logger.silent = true;
}
