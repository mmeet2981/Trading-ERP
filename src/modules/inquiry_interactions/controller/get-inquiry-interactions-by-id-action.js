const { ValidationError } = require('../../../utils/errors');

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getInquiryInteractionsById
}) {
  return async (req, res) => {
    const logger = req.log;
    const requestId = req.id || Date.now().toString();
    const context = { 
      requestId,
      operation: 'getInquiryInteractionsByIdAction',
      method: req.method,
      url: req.url,
      ip: req.ip
    };
    
    try {
      logger.info(context, 'Received get inquiry interactions by ID request');
      
      // Extract inquiry ID from URL parameters
      const inquiryId = parseInt(req.params.id);
      
      if (!inquiryId || isNaN(inquiryId)) {
        logger.warn({ ...context, inquiryId: req.params.id }, 'Invalid inquiry ID');
        throw new ValidationError('Valid inquiry ID is required');
      }
      
      // Extract query parameters
      const {
        interaction_type,
        outcome,
        follow_up_status,
        follow_up_required,
        created_by,
        start_date,
        end_date,
        interaction_date,
        sort_by = 'ii.interaction_datetime',
        sort_order = 'desc',
        page = 1,
        limit = 20
      } = req.query;

      // Prepare filters object
      const filters = {};
      
      // Only add filters if they have values
      if (interaction_type) filters.interaction_type = interaction_type;
      if (outcome) filters.outcome = outcome;
      if (follow_up_status) filters.follow_up_status = follow_up_status;
      if (follow_up_required !== undefined) {
        filters.follow_up_required = follow_up_required === 'true';
      }
      if (created_by) filters.created_by = parseInt(created_by);
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (interaction_date) filters.interaction_date = interaction_date;
      
      filters.sort_by = sort_by;
      filters.sort_order = sort_order;

      // Prepare pagination
      const pagination = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      logger.debug({ 
        ...context, 
        inquiryId,
        filters,
        pagination 
      }, 'Extracted parameters');

      // Call use case
      const result = await getInquiryInteractionsById({
        inquiryId,
        filters,
        pagination,
        logger: logger.child({ module: 'getInquiryInteractionsByIdUsecase', requestId })
      });

      logger.info({ 
        ...context, 
        inquiryId: result.inquiry_details.id,
        inquiryCode: result.inquiry_details.inquiry_code,
        count: result.interactions.length,
        total: result.pagination.total,
        page: result.pagination.page,
        statusCode: 200 
      }, 'Inquiry interactions retrieved successfully');

      // Send success response
      createSuccessResponse(
        200,
        {
          message: 'Inquiry interactions retrieved successfully',
          data: {
            inquiry: result.inquiry_details,
            interactions: result.interactions,
            pagination: result.pagination,
            filters: Object.keys(filters).length > 0 ? filters : undefined
          }
        },
        res
      );
    } catch (error) {
      const errorContext = {
        ...context,
        error: error.message,
        errorName: error.name,
        statusCode: error.statusCode || 500
      };
      
      if (error.name === 'ValidationError') {
        logger.warn(errorContext, 'Validation error in get inquiry interactions by ID');
      } else if (error.name === 'NotFoundError') {
        logger.warn(errorContext, 'Inquiry not found');
      } else {
        logger.error(errorContext, 'Error in getInquiryInteractionsByIdAction');
      }
      
      createErrorResponse(error, res);
    }
  };
};