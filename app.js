import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config/config.js';
import apiRoutes from './routes/index.js';
import { AppError } from './utils/AppError.js';
import Logger from './utils/logger.js';
import { requestLogger } from './middlewares/requestLogger.js';

const app = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  }),
);

// CORS configuration
app.use(
  cors({
    origin:
      config.env === 'production'
        ? ['https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: config.env === 'production' ? 100 : 1000, // requests per window
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
  });
});

// Database connection
if (config.db) {
  mongoose.connect(config.db)
    .then(() => {
      console.log('📦 Database connected successfully');
      Logger.info('Database connected successfully');
    })
    .catch(err => {
      console.error('❌ Database connection failed:', err.message);
      Logger.error('Database connection failed', { error: err.message });
    });
}

// API routes
app.use('/api/v1', apiRoutes);

// Legacy API endpoint
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'E-Commerce API v1.0',
    status: 'Active',
    timestamp: new Date().toISOString(),
  });
});

// Sample error routes for testing error handlers
app.get('/api/test/sync-error', (req, res) => {
  // This will trigger the global error handler
  throw new Error('This is a synchronous error for testing');
});

app.get('/api/test/async-error', async (req, res) => {
  // This will trigger the global error handler
  throw new Error('This is an async error for testing');
});

app.get('/api/test/promise-rejection', (req, res) => {
  // This will trigger unhandledRejection in server.js
  Promise.reject(new Error('Unhandled promise rejection'));
  res.json({ message: 'This response will never be sent' });
});

app.get('/api/test/uncaught-exception', (req, res) => {
  // This will trigger uncaughtException in server.js
  setTimeout(() => {
    throw new Error('Uncaught exception from setTimeout');
  }, 100);
  res.json({ message: 'Response sent, but error will occur after' });
});

app.get('/api/test/validation-error', (req, res) => {
  // This will trigger ValidationError handling
  const error = new Error('Invalid input data');
  error.name = 'ValidationError';
  throw error;
});

app.get('/api/test/cast-error', (req, res) => {
  // This will trigger CastError handling
  const error = new Error('Invalid ObjectId format');
  error.name = 'CastError';
  throw error;
});

app.get('/api/test/duplicate-error', (req, res) => {
  // This will trigger duplicate field error handling
  const error = new Error('Duplicate key error');
  error.code = 11000;
  throw error;
});

app.get('/api/test/custom-status', (req, res) => {
  // This will trigger custom status code error
  const error = new Error('Custom error with status code');
  error.statusCode = 422;
  throw error;
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((err, req, res, next) => {
  Logger.error('Application error', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user?.userId
  });

  // Default error response
  let error = {
    message:
      config.env === 'production' ? 'Something went wrong!' : err.message,
    timestamp: new Date().toISOString(),
  };

  // Include stack trace in development
  if (config.env === 'development') {
    error.stack = err.stack;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({ ...error, type: 'Validation Error' });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ ...error, type: 'Invalid ID format' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ ...error, type: 'Duplicate field value' });
  }

  // Default server error
  res.status(err.statusCode || 500).json(error);
});

export default app;
