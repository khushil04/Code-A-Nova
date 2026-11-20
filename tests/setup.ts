// Test environment setup — set env vars before any imports
process.env.NODE_ENV = 'test';
process.env.PORT = '0'; // random port
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.JWT_ACCESS_EXPIRY = '15m';
process.env.JWT_REFRESH_EXPIRY = '7d';
process.env.ENCRYPTION_KEY = 'a'.repeat(64); // 64 hex chars = 32 bytes
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/securevault_test';
process.env.CORS_ORIGIN = 'http://localhost:3000';
