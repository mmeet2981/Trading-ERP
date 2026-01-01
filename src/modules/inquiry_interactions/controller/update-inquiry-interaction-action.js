const { ValidationError } = require('../../../utils/errors');

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateInquiryInteraction
}) {
  return async (req, res) => {
    const logger = req.log;
    const requestId = req.id || Date.now().toString();
    const context = {
      requestId,
      operation: 'updateInquiryInteractionAction',
      method: req.method,
      url: req.url,
      ip: req.ip
    };

    try {
      logger.info(context, 'Received update inquiry interaction request');

      // Extract interaction ID from URL parameters
      const interactionId = parseInt(req.params.id);

      if (!interactionId || isNaN(interactionId)) {
        logger.warn({ ...context, interactionId: req.params.id }, 'Invalid interaction ID');
        throw new ValidationError('Valid interaction ID is required');
      }

      // Extract update data from request body
      const updateData = {
        interaction_type: req.body.interaction_type,
        interaction_datetime: req.body.interaction_datetime,
        outcome: req.body.outcome,
        summary: req.body.summary,
        follow_up_required: req.body.follow_up_required,
        follow_up_datetime: req.body.follow_up_datetime,
        follow_up_status: req.body.follow_up_status,
        created_by: req.body.created_by
      };

      // Remove undefined/null values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      logger.debug({
        ...context,
        interactionId,
        updateData
      }, 'Extracted update data');

      // Check if update data is empty
      if (Object.keys(updateData).length === 0) {
        logger.warn(context, 'No update data provided');
        throw new ValidationError('No fields to update provided');
      }

      // Call use case
      const result = await updateInquiryInteraction({
        interactionId,
        updateData,
        logger: logger.child({ module: 'updateInquiryInteractionUsecase', requestId })
      });

      logger.info({
        ...context,
        interactionId: result.id,
        statusCode: 200
      }, 'Inquiry interaction updated successfully');

      // Send success response
      createSuccessResponse(
        200,
        {
          message: 'Inquiry interaction updated successfully',
          data: {
            id: result.id,
            inquiry_id: result.inquiry_id,
            interaction_type: result.interaction_type,
            interaction_datetime: result.interaction_datetime,
            outcome: result.outcome,
            summary: result.summary,
            follow_up_required: result.follow_up_required,
            follow_up_datetime: result.follow_up_datetime,
            follow_up_status: result.follow_up_status,
            created_by: result.created_by,
            created_at: result.created_at
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
        logger.warn(errorContext, 'Validation error in update inquiry interaction');
      } else if (error.name === 'NotFoundError') {
        logger.warn(errorContext, 'Inquiry interaction not found for update');
      } else {
        logger.error(errorContext, 'Error in updateInquiryInteractionAction');
      }

      createErrorResponse(error, res);
    }
  };
};

