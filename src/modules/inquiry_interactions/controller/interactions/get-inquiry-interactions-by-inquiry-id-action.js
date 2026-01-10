const { ValidationError } = require('../../../../utils/errors');

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  getInquiryInteractionsByInquiryId
}) {
  return async (req, res) => {
    const logger = req.log;
    const requestId = req.id || Date.now().toString();
    const context = {
      requestId,
      operation: 'getInquiryInteractionsByInquiryIdAction',
      method: req.method,
      url: req.url,
      ip: req.ip
    };

    try {
      logger.info(context, 'Received get inquiry interactions by inquiry ID request');

      // Extract inquiry_id from URL parameters
      const inquiryId = parseInt(req.params.inquiryId);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 50;

      if (!inquiryId || isNaN(inquiryId)) {
        logger.warn({ ...context, inquiryId: req.params.inquiryId }, 'Invalid inquiry ID');
        throw new ValidationError('Valid inquiry ID is required');
      }

      // Prepare pagination
      const pagination = {
        page: page,
        limit: limit
      };

      // Prepare filters - can add more filters here if needed
      const filters = {
        // inquiry_id is passed separately to the usecase
      };

      logger.debug({
        ...context,
        inquiryId,
        filters,
        pagination
      }, 'Extracted parameters');

      // Call use case
      const result = await getInquiryInteractionsByInquiryId({
        inquiryId,
        filters,
        pagination,
        logger: logger.child({ module: 'getInquiryInteractionsByIdUsecase', requestId })
      });

      logger.info({
        ...context,
        inquiryId,
        count: result.interactions.length,
        total: result.pagination.total,
        page: result.pagination.page
      }, 'Inquiry interactions retrieved successfully');

      // Send success response
      createSuccessResponse(
        200,
        {
          message: 'Inquiry interactions retrieved successfully',
          data: {
            inquiry: result.inquiry_details,
            interactions: result.interactions,
            pagination: result.pagination
          },
          inquiry_id: inquiryId
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
        logger.warn(errorContext, 'Validation error in get inquiry interactions');
      } else {
        logger.error(errorContext, 'Error in getInquiryInteractionsByInquiryIdAction');
      }

      createErrorResponse(error, res);
    }
  };
};