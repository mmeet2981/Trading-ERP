const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const pinoHttp = require('pino-http');
const routes = require('./routes');
const { logger } = require('./utils/logger');

const app = express();

// Create pino-http instance
const httpLogger = pinoHttp({
  logger,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
      }
    }),
    res: (res) => ({
      statusCode: res.statusCode
    })
  },
  customLogLevel: function (req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(httpLogger); // Use pino-http for request logging
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add logger to request object
app.use((req, res, next) => {
  req.log = req.log || logger;
  next();
});

// Routes
app.use('/', routes);

module.exports = app;