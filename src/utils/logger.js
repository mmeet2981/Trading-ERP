const pino = require('pino');

// Development logger with pretty printing
const devLogger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
    }
  }
});

// Production logger (JSON format)
const prodLogger = pino({
  level: 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    }
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`
});

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

// Create child logger for specific modules
const createModuleLogger = (moduleName) => {
  return logger.child({ module: moduleName });
};

module.exports = {
  logger,
  createModuleLogger
};