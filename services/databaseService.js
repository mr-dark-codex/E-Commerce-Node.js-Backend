import { getWriteConnection, getReadConnection } from '../config/database.js';

class DatabaseService {
  // Write operations (CREATE, UPDATE, DELETE)
  static async create(Model, data) {
    const connection = getWriteConnection();
    const ModelWithWriteConn = connection.model(Model.modelName);
    return await ModelWithWriteConn.create(data);
  }

  static async updateById(Model, id, data) {
    const connection = getWriteConnection();
    const ModelWithWriteConn = connection.model(Model.modelName);
    return await ModelWithWriteConn.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteById(Model, id) {
    const connection = getWriteConnection();
    const ModelWithWriteConn = connection.model(Model.modelName);
    return await ModelWithWriteConn.findByIdAndDelete(id);
  }

  // Read operations (SELECT/FIND)
  static async findById(Model, id, options = {}) {
    const connection = getReadConnection();
    const ModelWithReadConn = connection.model(Model.modelName, Model.schema);
    return await ModelWithReadConn.findById(id, options.select, options);
  }

  static async find(Model, query = {}, options = {}) {
    const connection = getReadConnection();
    const ModelWithReadConn = connection.model(Model.modelName, Model.schema);
    return await ModelWithReadConn.find(query, options.select, options);
  }

  static async findOne(Model, query = {}, options = {}) {
    const connection = getReadConnection();
    const ModelWithReadConn = connection.model(Model.modelName, Model.schema);
    return await ModelWithReadConn.findOne(query, options.select, options);
  }

  static async count(Model, query = {}) {
    const connection = getReadConnection();
    const ModelWithReadConn = connection.model(Model.modelName, Model.schema);
    return await ModelWithReadConn.countDocuments(query);
  }

  static async aggregate(Model, pipeline) {
    const connection = getReadConnection();
    const ModelWithReadConn = connection.model(Model.modelName, Model.schema);
    return await ModelWithReadConn.aggregate(pipeline);
  }
}

export default DatabaseService;
