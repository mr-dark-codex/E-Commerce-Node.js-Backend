import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';

export const healthCheck = async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0',
    services: {},
  };

  // Database health
  try {
    if (mongoose.connection.readyState === 1) {
      health.services.database = { status: 'UP', responseTime: 0 };
    } else {
      health.services.database = { status: 'DOWN', error: 'Not connected' };
      health.status = 'DEGRADED';
    }
  } catch (error) {
    health.services.database = { status: 'DOWN', error: error.message };
    health.status = 'DEGRADED';
  }

  // Memory usage
  const memUsage = process.memoryUsage();
  health.memory = {
    used: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
    total: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
  };

  const statusCode = health.status === 'OK' ? 200 : 503;
  res
    .status(statusCode)
    .json(new ApiResponse(statusCode, health, 'Health check completed'));
};
