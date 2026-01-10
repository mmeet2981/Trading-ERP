module.exports = function ({
    createErrorResponse,
    createSuccessResponse,
    softDeleteInquiry
  }) {
    return async (req, res) => {
      const logger = req.log;
      const requestId = req.id || Date.now().toString();
      const context = { 
        requestId,
        operation: 'softDeleteInquiryAction',
        method: req.method,
        url: req.url,
        ip: req.ip
      };
      
      try {
        logger.info(context, 'Received soft delete inquiry request');
        
        // Extract inquiry ID from URL parameters
        const inquiryId = parseInt(req.params.id);
        
        if (!inquiryId || isNaN(inquiryId)) {
          logger.warn({ ...context, inquiryId: req.params.id }, 'Invalid inquiry ID');
          throw new ValidationError('Valid inquiry ID is required');
        }
        
        logger.debug({ 
          ...context, 
          inquiryId
        }, 'Extracted inquiry ID');
  
        // Call use case
        const result = await softDeleteInquiry({
          inquiryId,
          logger: logger.child({ module: 'softDeleteInquiryUsecase', requestId })
        });
  
        logger.info({ 
          ...context, 
          inquiryId: result.id,
          inquiryCode: result.inquiry_code,
          statusCode: 200 
        }, 'Inquiry soft deleted successfully');
  
        // Send success response
        createSuccessResponse(
          200,
          {
            message: 'Inquiry soft deleted successfully',
            data: result
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
          logger.warn(errorContext, 'Validation error in soft delete inquiry');
        } else if (error.name === 'NotFoundError') {
          logger.warn(errorContext, 'Inquiry not found for soft delete');
        } else {
          logger.error(errorContext, 'Error in softDeleteInquiryAction');
        }
        
        createErrorResponse(error, res);
      }
    };
  };