'use strict';

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
};