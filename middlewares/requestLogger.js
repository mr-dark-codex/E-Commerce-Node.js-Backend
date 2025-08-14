import Logger from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request start
  Logger.info(`Incoming ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.userId,
  });

  // Override res.end to capture response time
  const originalEnd = res.end;
  res.end = function (...args) {
    const responseTime = Date.now() - startTime;

    // Log request completion
    Logger.logRequest(req, res, responseTime);

    originalEnd.apply(this, args);
  };

  next();
};
