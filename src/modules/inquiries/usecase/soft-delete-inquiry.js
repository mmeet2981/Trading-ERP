module.exports = function ({
    inquiryDb,
    UnknownError,
    NotFoundError,
    ValidationError,
    Joi
  }) {
    return async ({
      inquiryId,
      deletedBy,
      logger
    }) => {
      const context = { 
        operation: 'softDeleteInquiry',
        inquiryId,
        deletedBy
      };
      
      logger.info(context, 'Processing soft delete inquiry request');
  
      // Validation schema
      const paramsSchema = Joi.object({
        inquiryId: Joi.number().integer().min(1).required().label('Inquiry ID'),
        deletedBy: Joi.number().integer().min(1).allow(null).label('Deleted By User ID')
      });
  
      // Validate parameters
      try {
        logger.debug({ ...context }, 'Validating parameters');
        
        const validatedParams = await paramsSchema.validateAsync({
          inquiryId,
          deletedBy
        }, { abortEarly: false });
        
        logger.debug({ ...context, validatedParams }, 'Validation passed');
  
        // Get sequelize instance from inquiryDb
        const { sequelize } = inquiryDb;
        
        // Start transaction
        logger.debug(context, 'Starting database transaction');
        const transaction = await sequelize.transaction();
  
        try {
          // Validate deletedBy user exists if provided
          if (validatedParams.deletedBy) {
            logger.debug({ ...context, userId: validatedParams.deletedBy }, 'Validating user who is deleting');
            
            const user = await inquiryDb.getUserById({
              userId: validatedParams.deletedBy,
              logger,
              transaction
            });
  
            if (!user) {
              throw new ValidationError('User not found');
            }
          }
  
          // Perform soft delete
          const result = await inquiryDb.softDeleteInquiry({
            inquiryId: validatedParams.inquiryId,
            deletedBy: validatedParams.deletedBy,
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