import winston from 'winston';
import path from 'path';
import fs from 'fs';
import Log from '../models/Log.js';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for file logging
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Custom format for console logging
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat
    }),
    
    // Daily rotating file for all logs
    new winston.transports.File({
      filename: path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`),
      level: 'info'
    }),
    
    // Daily rotating file for errors only
    new winston.transports.File({
      filename: path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`),
      level: 'error'
    })
  ]
});

// MongoDB transport function
const saveToMongoDB = async (level, message, meta = {}) => {
  try {
    await Log.create({
      level,
      message,
      meta,
      timestamp: new Date(),
      source: 'backend'
    });
  } catch (error) {
    // Fallback to console if MongoDB fails
    console.error('Failed to save log to MongoDB:', error.message);
  }
};

// Enhanced logger with MongoDB integration
export const Logger = {
  info: (message, meta = {}) => {
    logger.info(message, meta);
    saveToMongoDB('info', message, meta);
  },
  
  warn: (message, meta = {}) => {
    logger.warn(message, meta);
    saveToMongoDB('warn', message, meta);
  },
  
  error: (message, meta = {}) => {
    logger.error(message, meta);
    saveToMongoDB('error', message, meta);
  },
  
  debug: (message, meta = {}) => {
    logger.debug(message, meta);
    saveToMongoDB('debug', message, meta);
  },

  // HTTP request logging
  logRequest: (req, res, responseTime) => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      responseTime,
      userId: req.user?.userId
    };
    
    const message = `${req.method} ${req.originalUrl} - ${res.statusCode} - ${responseTime}ms`;
    
    if (res.statusCode >= 400) {
      Logger.error(message, logData);
    } else {
      Logger.info(message, logData);
    }
  }
};

export default Logger;