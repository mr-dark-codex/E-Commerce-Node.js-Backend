import { LogService } from '../services/LogService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Logger from '../utils/logger.js';

export class LogController {
  constructor() {
    this.logService = new LogService();
  }

  getLogs = asyncHandler(async (req, res) => {
    const { page, limit, level, startDate, endDate } = req.query;
    const result = await this.logService.getLogs(
      {},
      {
        page: parseInt(page),
        limit: parseInt(limit),
        level,
        startDate,
        endDate,
      },
    );

    res
      .status(200)
      .json(new ApiResponse(200, result, 'Logs retrieved successfully'));
  });

  getLogStats = asyncHandler(async (req, res) => {
    const { days } = req.query;
    const stats = await this.logService.getLogStats(parseInt(days) || 7);

    res
      .status(200)
      .json(
        new ApiResponse(200, stats, 'Log statistics retrieved successfully'),
      );
  });

  cleanOldLogs = asyncHandler(async (req, res) => {
    const { days } = req.body;
    const result = await this.logService.cleanOldLogs(parseInt(days) || 30);

    Logger.info('Old logs cleaned', {
      deletedCount: result.deletedCount,
      cutoffDate: result.cutoffDate,
      adminId: req.user.userId,
    });

    res
      .status(200)
      .json(new ApiResponse(200, result, 'Old logs cleaned successfully'));
  });

  archiveLogs = asyncHandler(async (req, res) => {
    await this.logService.archiveLogFiles();

    Logger.info('Log files archived', { adminId: req.user.userId });

    res
      .status(200)
      .json(new ApiResponse(200, {}, 'Log files archived successfully'));
  });
}
