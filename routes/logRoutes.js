import express from 'express';
import { LogController } from '../controllers/LogController.js';
import { authenticate, authorize } from '../middlewares/auth.js';

const router = express.Router();
const logController = new LogController();

// All log routes require admin access
router.use(authenticate);
router.use(authorize('admin'));

router.get('/', logController.getLogs);
router.get('/stats', logController.getLogStats);
router.post('/clean', logController.cleanOldLogs);
router.post('/archive', logController.archiveLogs);

export default router;