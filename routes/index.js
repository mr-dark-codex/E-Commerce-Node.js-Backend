import express from 'express';
import userRoutes from './userRoutes.js';
import logRoutes from './logRoutes.js';

const router = express.Router();

// API routes
router.use('/users', userRoutes);
router.use('/logs', logRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
