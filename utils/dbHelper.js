import DatabaseService from '../services/databaseService.js';

// Helper functions for common database operations
export const dbRead = {
  findById: (Model, id, options) =>
    DatabaseService.findById(Model, id, options),
  find: (Model, query, options) => DatabaseService.find(Model, query, options),
  findOne: (Model, query, options) =>
    DatabaseService.findOne(Model, query, options),
  count: (Model, query) => DatabaseService.count(Model, query),
  aggregate: (Model, pipeline) => DatabaseService.aggregate(Model, pipeline),
};

export const dbWrite = {
  create: (Model, data) => DatabaseService.create(Model, data),
  updateById: (Model, id, data) => DatabaseService.updateById(Model, id, data),
  deleteById: (Model, id) => DatabaseService.deleteById(Model, id),
};

// Convenience function for paginated reads
export const paginatedFind = async (Model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 2,
    sort = { createdAt: -1 },
    ...otherOptions
  } = options;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    dbRead.find(Model, query, { ...otherOptions, sort, skip, limit }),
    dbRead.count(Model, query),
  ]);

  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};
