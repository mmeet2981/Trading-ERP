module.exports = function ({
  inquiryInteractionDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
}) {
  return async ({
    interactionId,
    logger
  }) => {
    const context = {
      operation: 'deleteInquiryInteraction',
      interactionId
    };

    logger.info(context, 'Processing delete inquiry interaction request');

    // Simple validation schema
    const paramsSchema = Joi.object({
      interactionId: Joi.number().integer().min(1).required().label('Interaction ID')
    });

    // Validate parameters
    try {
      logger.debug({ ...context }, 'Validating parameters');

      const validatedParams = await paramsSchema.validateAsync({
        interactionId
      }, { abortEarly: false });

      logger.debug({ ...context, validatedParams }, 'Validation passed');

      // Get sequelize instance from inquiryInteractionDb
      const { sequelize } = inquiryInteractionDb;

      // Start transaction
      logger.debug(context, 'Starting database transaction');
      const transaction = await sequelize.transaction();

      try {
        // Perform delete
        const result = await inquiryInteractionDb.deleteInquiryInteraction({
          interactionId: validatedParams.interactionId,
          transaction,
          logger
        });

        // Commit transaction
        await transaction.commit();

        logger.info({
          ...context,
          interactionId: result.id,
          transaction: 'committed'
        }, 'Inquiry interaction deleted successfully');

        return result;
      } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        logger.error({
          ...context,
          error: error.message,
          stack: error.stack,
          transaction: 'rolled back'
        }, 'Error in deleteInquiryInteraction use case');

        if (error instanceof ValidationError || error.name === 'ValidationError') {
          throw error;
        }

        if (error instanceof NotFoundError) {
          throw error;
        }

        throw new UnknownError('Failed to delete inquiry interaction');
      }
    } catch (validationError) {
      const validationErrors = validationError.details?.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })) || [{ message: validationError.message }];

      logger.warn({ ...context, errors: validationErrors }, 'Validation failed for delete');
      throw new ValidationError(validationError.message);
    }
  };
};

