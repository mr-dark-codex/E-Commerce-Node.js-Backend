import mongoose from 'mongoose';
import Logger from '../utils/logger.js';

const connectDB = async (retries = 5) => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    });

    Logger.info('Database connected successfully', {
      host: conn.connection.host,
      name: conn.connection.name,
    });

    return conn;
  } catch (error) {
    Logger.error('Database connection failed', {
      error: error.message,
      retries: retries - 1,
    });

    if (retries > 0) {
      Logger.info(
        `Retrying database connection in 5 seconds... (${retries} attempts left)`,
      );
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      process.exit(1);
    }
  }
};

export default connectDB;
