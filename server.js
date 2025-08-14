import http from 'http';
import chalk from 'chalk';
import config from './config/config.js';
import app from './app.js';
import Logger from './utils/logger.js';
import { startLogCleanupScheduler } from './utils/scheduler.js';

const server = http.createServer(app);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(chalk.red('Uncaught Exception:'), err.message);
  Logger.error('Uncaught Exception', {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(chalk.red('Unhandled Rejection:'), err.message);
  Logger.error('Unhandled Promise Rejection', {
    message: err.message,
    stack: err.stack,
  });
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log(chalk.yellow('SIGTERM received. Shutting down gracefully...'));
  server.close(() => {
    console.log(chalk.green('Process terminated'));
  });
});

process.on('SIGINT', () => {
  console.log(chalk.yellow('SIGINT received. Shutting down gracefully...'));
  server.close(() => {
    console.log(chalk.green('Process terminated'));
  });
});

// Start server
server.listen(config.port, () => {
  console.log(chalk.cyan(`🚀 Server running on port ${config.port}`));
  console.log(chalk.cyan(`📍 Environment: ${config.env}`));
  console.log(chalk.cyan(`🌐 URL: http://localhost:${config.port}`));

  Logger.info('Server started successfully', {
    port: config.port,
    environment: config.env,
    url: `http://localhost:${config.port}`,
  });

  // Start log cleanup scheduler
  startLogCleanupScheduler();
});

// Handle server errors
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind =
    typeof config.port === 'string'
      ? 'Pipe ' + config.port
      : 'Port ' + config.port;

  switch (error.code) {
    case 'EACCES':
      console.error(chalk.red(`${bind} requires elevated privileges`));
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(chalk.red(`${bind} is already in use`));
      process.exit(1);
      break;
    default:
      throw error;
  }
});

export default server;
