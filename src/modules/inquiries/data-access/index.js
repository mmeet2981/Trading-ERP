const sequelize = require('../../../config/db');
const { UnknownError, NotFoundError } = require('../../../utils/errors');
const { createModuleLogger } = require('../../../utils/logger');

const makeInquiryDb = require('./inquiry-db');

// Create module-specific logger
const moduleLogger = createModuleLogger('inquiry-data-access');

const inquiryDb = makeInquiryDb({
  sequelize,
  UnknownError,
  NotFoundError
});

// Wrap functions with module logger
const wrappedInquiryDb = {
  ...inquiryDb,
  
  createInquiry: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryDb.createInquiry({ ...params, logger });
  },
  
  getInquiryCountForToday: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryDb.getInquiryCountForToday({ ...params, logger });
  },
  
  getCustomerById: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryDb.getCustomerById({ ...params, logger });
  },
  
  getUserById: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryDb.getUserById({ ...params, logger });
  },
  
  findOrCreateCustomer: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryDb.findOrCreateCustomer({ ...params, logger });
  },
  
  sequelize: inquiryDb.sequelize
};

module.exports = {
  inquiryDb: wrappedInquiryDb
};