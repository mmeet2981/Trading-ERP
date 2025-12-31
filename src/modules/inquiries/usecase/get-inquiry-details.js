module.exports = function ({
    inquiryDb,
    UnknownError,
    NotFoundError,
    ValidationError,
    Joi
  }) {
    return async ({
      inquiryId,
      includeInteractions = true,
      logger
    }) => {
      const context = { 
        operation: 'getInquiryDetails',
        inquiryId,
        includeInteractions
      };
      
      logger.info(context, 'Processing get inquiry details request');
  
      // Validation schema for inquiryId
      const paramsSchema = Joi.object({
        inquiryId: Joi.number().integer().min(1).required().label('Inquiry ID'),
        includeInteractions: Joi.boolean().default(true).label('Include Interactions')
      });
  
      // Validate parameters
      try {
        logger.debug({ ...context }, 'Validating parameters');
        
        const validatedParams = await paramsSchema.validateAsync({
          inquiryId,
          includeInteractions
        }, { abortEarly: false });
        
        logger.debug({ ...context, validatedParams }, 'Validation passed, fetching data');
  
        // Call data access layer
        const inquiryDetails = await inquiryDb.getInquiryById({
          inquiryId: validatedParams.inquiryId,
          logger
        });
  
        // If interactions are not needed, remove them from response
        if (!validatedParams.includeInteractions) {
          delete inquiryDetails.interactions;
          delete inquiryDetails.interaction_summary;
        }
  
        logger.info({ 
          ...context, 
          inquiryCode: inquiryDetails.inquiry_code,
          status: inquiryDetails.status 
        }, 'Inquiry details fetched successfully');
  
        return inquiryDetails;
      } catch (validationError) {
        const validationErrors = validationError.details?.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        })) || [{ message: validationError.message }];
        
        logger.warn({ ...context, errors: validationErrors }, 'Validation failed for inquiry details');
        throw new ValidationError(validationError.message);
      }
    };
  };