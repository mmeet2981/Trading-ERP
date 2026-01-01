const sequelize = require('../../../config/db');
const { UnknownError, NotFoundError } = require('../../../utils/errors');
const { createModuleLogger } = require('../../../utils/logger');

const makeInquiryInteractionDb = require('./inquiry-interaction-db');

// Create module-specific logger
const moduleLogger = createModuleLogger('inquiry-interaction-data-access');

const inquiryInteractionDb = makeInquiryInteractionDb({
  sequelize,
  UnknownError,
  NotFoundError
});

// Wrap functions with module logger
const wrappedInquiryInteractionDb = {
  ...inquiryInteractionDb,
  
  createInquiryInteraction: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryInteractionDb.createInquiryInteraction({ ...params, logger });
  },
  
  updateInquiryInteraction: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryInteractionDb.updateInquiryInteraction({ ...params, logger });
  },
  
  deleteInquiryInteraction: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryInteractionDb.deleteInquiryInteraction({ ...params, logger });
  },
  
  getInquiryInteractionById: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryInteractionDb.getInquiryInteractionById({ ...params, logger });
  },
  
  getInquiryInteractionList: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryInteractionDb.getInquiryInteractionList({ ...params, logger });
  },
  
  validateInquiryExists: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryInteractionDb.validateInquiryExists({ ...params, logger });
  },
  
  getUserById: (params) => {
    const logger = params.logger || moduleLogger;
    return inquiryInteractionDb.getUserById({ ...params, logger });
  },
  
  sequelize: inquiryInteractionDb.sequelize
};

module.exports = {
  inquiryInteractionDb: wrappedInquiryInteractionDb
};

