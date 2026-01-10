module.exports = function ({
    inquiryDb,
    UnknownError,
    NotFoundError,
    ValidationError,
    Joi
  }) {
    return async ({
      inquiryId,
      logger
    }) => {
      const context = { 
        operation: 'softDeleteInquiry',
        inquiryId
      };
      
      logger.info(context, 'Processing soft delete inquiry request');
  
      // Simple validation schema
      const paramsSchema = Joi.object({
        inquiryId: Joi.number().integer().min(1).required().label('Inquiry ID')
      });
  
      // Validate parameters
      try {
        logger.debug({ ...context }, 'Validating parameters');
        
        const validatedParams = await paramsSchema.validateAsync({
          inquiryId
        }, { abortEarly: false });
        
        logger.debug({ ...context, validatedParams }, 'Validation passed');
  
        // Get sequelize instance from inquiryDb
        const { sequelize } = inquiryDb;
        
        // Start transaction
        logger.debug(context, 'Starting database transaction');
        const transaction = await sequelize.transaction();
  
        try {
          // Perform soft delete
          const result = await inquiryDb.softDeleteInquiry({
            inquiryId: validatedParams.inquiryId,
            transaction,
            logger
          });
  
          // Commit transaction
          await transaction.commit();
          
          logger.info({ 
            ...context, 
            inquiryId: result.id,
            inquiryCode: result.inquiry_code,
            transaction: 'committed'
          }, 'Inquiry soft deleted successfully');
          
          return result;
        } catch (error) {
          // Rollback transaction on error
          await transaction.rollback();
          logger.error({ 
            ...context, 
            error: error.message, 
            stack: error.stack,
            transaction: 'rolled back'
          }, 'Error in softDeleteInquiry use case');
          
          if (error instanceof ValidationError || error.name === 'ValidationError') {
            throw error;
          }
          
          if (error instanceof NotFoundError) {
            throw error;
          }
          
          throw new UnknownError('Failed to soft delete inquiry');
        }
      } catch (validationError) {
        const validationErrors = validationError.details?.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        })) || [{ message: validationError.message }];
        
        logger.warn({ ...context, errors: validationErrors }, 'Validation failed for soft delete');
        throw new ValidationError(validationError.message);
      }
    };
  };