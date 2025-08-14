import Log from '../models/Log.js';
import fs from 'fs';
import path from 'path';

export class LogService {
  // Get logs from MongoDB with filtering
  async getLogs(filter = {}, options = {}) {
    const { page = 1, limit = 50, level, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const query = { ...filter };

    if (level) query.level = level;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const logs = await Log.find(query)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email');

    const total = await Log.countDocuments(query);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Clean old logs (older than specified days)
  async cleanOldLogs(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await Log.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    return {
      deletedCount: result.deletedCount,
      cutoffDate,
    };
  }

  // Get log statistics
  async getLogStats(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await Log.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
        },
      },
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});
  }

  // Archive old log files
  async archiveLogFiles() {
    const logsDir = path.join(process.cwd(), 'logs');
    const archiveDir = path.join(logsDir, 'archive');

    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    const files = fs.readdirSync(logsDir);
    const today = new Date().toISOString().split('T')[0];

    files.forEach((file) => {
      if (file.endsWith('.log') && !file.includes(today)) {
        const sourcePath = path.join(logsDir, file);
        const destPath = path.join(archiveDir, file);
        fs.renameSync(sourcePath, destPath);
      }
    });
  }
}
