module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createInquiryInteraction
}) {
  return async (req, res) => {
    const logger = req.log;
    const requestId = req.id || Date.now().toString();
    const context = { 
      requestId,
      operation: 'createInquiryInteractionAction',
      method: req.method,
      url: req.url,
      ip: req.ip
    };
    
    try {
      logger.info(context, 'Received create inquiry interaction request');
      
      // Extract interaction data from request body
      const interactionData = {
        inquiry_id: req.body.inquiry_id,
        interaction_type: req.body.interaction_type,
        interaction_datetime: req.body.interaction_datetime,
        outcome: req.body.outcome,
        summary: req.body.summary,
        follow_up_required: req.body.follow_up_required,
        follow_up_datetime: req.body.follow_up_datetime,
        follow_up_status: req.body.follow_up_status,
        created_by: req.body.created_by || req.user?.userId || null
      };

      logger.debug({ ...context, interactionData }, 'Prepared interaction data for use case');

      // Call use case
      const result = await createInquiryInteraction({
        interactionData,
        logger: logger.child({ module: 'inquiryInteractionUsecase', requestId })
      });

      logger.info({ 
        ...context, 
        interactionId: result.id,
        inquiryId: result.inquiry_id,
        statusCode: 201
      }, 'Inquiry interaction created successfully');

      // Send success response
      createSuccessResponse(
        201,
        {
          message: 'Inquiry interaction created successfully',
          interaction: {
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
        logger.warn(errorContext, 'Validation error in create inquiry interaction');
      } else if (error.name === 'NotFoundError') {
        logger.warn(errorContext, 'Inquiry not found for interaction');
      } else {
        logger.error(errorContext, 'Error in createInquiryInteractionAction');
      }
      
      createErrorResponse(error, res);
    }
  };
};

