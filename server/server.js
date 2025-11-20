'use strict';

/**
 * Module dependencies.
 */
const app = require('./config/lib/app');

// Handle uncaught exceptions
process.on('uncaughtException', function(err) {
  console.error('UNCAUGHT EXCEPTION - Server will crash:', err);
  console.error('Error stack:', err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', function(reason, promise) {
  console.error('UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
  if (reason && reason.stack) {
    console.error('Stack:', reason.stack);
  }
});

// Start the server
async function startServer() {
  try {
    await app.start(function (server, db, config) {
      // Handle graceful shutdown
      process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully');
        server.close(() => {
          console.log('Process terminated');
          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        console.log('SIGINT received, shutting down gracefully');
        server.close(() => {
          console.log('Process terminated');
          process.exit(0);
        });
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    console.error('Error stack:', err.stack);
    process.exit(1);
  }
}

startServer();
