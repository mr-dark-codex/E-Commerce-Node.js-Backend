import mongoose from 'mongoose';
import Logger from '../utils/logger.js';
import config from './config.js';

// Primary connection for write operations
let writeConnection = null;
// Secondary connection for read operations
let readConnection = null;

const connectDB = async (retries = 5) => {
  try {
    // Primary connection (writes)
    writeConnection = await mongoose.connect(config.db, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      readPreference: 'primary',
    });

    // Secondary connection (reads) - use same URI but different read preference
    readConnection = await mongoose.createConnection(config.db, {
      maxPoolSize: 20, // More connections for reads
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      readPreference: 'secondaryPreferred',
    });

    Logger.info('Database connections established successfully', {
      writeHost: writeConnection.connection.host,
      readHost: readConnection.host,
      dbName: writeConnection.connection.name,
    });

    return { writeConnection, readConnection };
  } catch (error) {
    Logger.error('Database connection failed', {
      error: error.message,
      retries: retries - 1,
    });

    if (retries > 0) {
      Logger.info(
        `Retrying database connection in 5 seconds... (${retries} attempts left)`,
      );
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    } else {
      throw new Error(`Database connection failed after ${5 - retries + 1} attempts`);
    }
  }
};

// Get write connection (Primary)
export const getWriteConnection = () => {
  if (!writeConnection) {
    throw new Error('Write connection not established');
  }
  return writeConnection;
};

// Get read connection (Secondary preferred)
export const getReadConnection = () => {
  if (!readConnection) {
    throw new Error('Read connection not established');
  }
  return readConnection;
};

export default connectDB;
