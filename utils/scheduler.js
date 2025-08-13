import { LogService } from '../services/LogService.js';
import Logger from './logger.js';

const logService = new LogService();

// Clean old logs daily at midnight
export const startLogCleanupScheduler = () => {
  const cleanupInterval = 24 * 60 * 60 * 1000; // 24 hours
  
  setInterval(async () => {
    try {
      const result = await logService.cleanOldLogs(30);
      Logger.info('Scheduled log cleanup completed', result);
      
      await logService.archiveLogFiles();
      Logger.info('Scheduled log archiving completed');
    } catch (error) {
      Logger.error('Scheduled log cleanup failed', { error: error.message });
    }
  }, cleanupInterval);
  
  Logger.info('Log cleanup scheduler started');
};