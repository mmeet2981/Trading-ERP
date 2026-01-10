const { ValidationError } = require('../../../../utils/errors');

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  deleteInquiryInteraction
}) {
  return async (req, res) => {
    const logger = req.log;
    const requestId = req.id || Date.now().toString();
    const context = {
      requestId,
      operation: 'deleteInquiryInteractionAction',
      method: req.method,
      url: req.url,
      ip: req.ip
    };

    try {
      logger.info(context, 'Received delete inquiry interaction request');

      // Extract interaction ID from URL parameters
      const interactionId = parseInt(req.params.id);

      if (!interactionId || isNaN(interactionId)) {
        logger.warn({ ...context, interactionId: req.params.id }, 'Invalid interaction ID');
        throw new ValidationError('Valid interaction ID is required');
      }

      logger.debug({
        ...context,
        interactionId
      }, 'Extracted parameters');

      // Call use case
      const result = await deleteInquiryInteraction({
        interactionId,
        logger: logger.child({ module: 'deleteInquiryInteractionUsecase', requestId })
      });

      logger.info({
        ...context,
        interactionId: result.id,
        statusCode: 200
      }, 'Inquiry interaction deleted successfully');

      // Send success response
      createSuccessResponse(
        200,
        {
          message: 'Inquiry interaction deleted successfully',
          data: {
            id: result.id,
            inquiry_id: result.inquiry_id,
            interaction_type: result.interaction_type
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
        logger.warn(errorContext, 'Validation error in delete inquiry interaction');
      } else if (error.name === 'NotFoundError') {
        logger.warn(errorContext, 'Inquiry interaction not found for deletion');
      } else {
        logger.error(errorContext, 'Error in deleteInquiryInteractionAction');
      }

      createErrorResponse(error, res);
    }
  };
};

