import express from 'express';
import userRoutes from './userRoutes.js';
import logRoutes from './logRoutes.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const router = express.Router();

// API routes
router.use('/users', userRoutes);
router.use('/logs', logRoutes);

// Health check
<<<<<<< HEAD
router.get(
  '/health',
  asyncHandler((req, res) => {
    res.status(200).json({
      status: 'OK',
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  }),
);
=======
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});
>>>>>>> 60eb885646de76b8f5b3d00134c581cf52d6ad6f

export default router;
