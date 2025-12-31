module.exports = function ({
    createErrorResponse,
    createSuccessResponse,
    getInquiryDetails
  }) {
    return async (req, res) => {
      const logger = req.log;
      const requestId = req.id || Date.now().toString();
      const context = { 
        requestId,
        operation: 'getInquiryDetailsAction',
        method: req.method,
        url: req.url,
        ip: req.ip
      };
      
      try {
        logger.info(context, 'Received get inquiry details request');
        
        // Extract parameters
        const inquiryId = parseInt(req.params.id);
        const includeInteractions = req.query.include_interactions !== 'false'; // Default true
        
        logger.debug({ 
          ...context, 
          inquiryId, 
          includeInteractions 
        }, 'Extracted parameters');
  
        // Call use case
        const inquiryDetails = await getInquiryDetails({
          inquiryId,
          includeInteractions,
          logger: logger.child({ module: 'inquiryDetailsUsecase', requestId })
        });
  
        logger.info({ 
          ...context, 
          inquiryId: inquiryDetails.id,
          inquiryCode: inquiryDetails.inquiry_code,
          status: inquiryDetails.status 
        }, 'Inquiry details retrieved successfully');
  
        // Send success response
        createSuccessResponse(
          200,
          {
            message: 'Inquiry details retrieved successfully',
            data: inquiryDetails
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
          logger.warn(errorContext, 'Validation error in get inquiry details');
        } else if (error.name === 'NotFoundError') {
          logger.warn(errorContext, 'Inquiry not found');
        } else {
          logger.error(errorContext, 'Error in getInquiryDetailsAction');
        }
        
        createErrorResponse(error, res);
      }
    };
  };