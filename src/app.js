'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

// Middleware - Security and parsing
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware - Use only morgan
app.use(morgan('combined'));

// Try to import logger from utils, fallback if not exists
let logger;
try {
  const { logger: utilsLogger } = require('./utils/logger');
  logger = utilsLogger;
} catch (error) {
  // Fallback to a simple console logger
  console.warn('utils/logger.js not found, using console logger');
  logger = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`),
    error: (msg, err) => {
      if (err) {
        console.error(`[ERROR] ${msg}`, err);
      } else {
        console.error(`[ERROR] ${msg}`);
      }
    },
    debug: (msg) => console.debug(`[DEBUG] ${msg}`)
  };
}

// Add logger to request object for consistency
app.use((req, res, next) => {
  req.log = logger;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  req.log.info('Health check called');
  res.json({ status: 'OK' });
});

// Try to load routes, but don't crash if they don't exist
const routes = require('./routes');
app.use('/', routes);


// 404 handler
app.use((req, res) => {
  req.log.warn(`Not found: ${req.method} ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  // Safe logging
  if (req && req.log) {
    req.log.error(err.message, err);
  } else {
    console.error(err);
  }

  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      type: err.name || 'UnknownError'
    }
  });
});


module.exports = app;