const app = require('./app');
const sequelize = require('./config/db');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 3000;

// Test database connection
async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error({ error: error.message }, 'Unable to connect to the database');
    process.exit(1);
  }
}

// Start server
async function startServer() {
  await testDatabaseConnection();
  
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Log level: ${process.env.LOG_LEVEL || 'info'}`);
  });
}

startServer();