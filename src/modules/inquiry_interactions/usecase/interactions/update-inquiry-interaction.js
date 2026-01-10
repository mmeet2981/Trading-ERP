// In update-inquiry-interaction.js
module.exports = function ({
  inquiryInteractionDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
}) {
  return async ({
    interactionId,
    updateData,
    logger
  }) => {
    const context = {
      operation: 'updateInquiryInteraction',
      interactionId,
      updateFields: Object.keys(updateData)
    };

    logger.info(context, 'Processing update inquiry interaction request');

    // Validation schema for update data
    const updateSchema = Joi.object({
      interaction_type: Joi.string().max(30).label('Interaction Type'),
      interaction_datetime: Joi.date().iso().allow(null).label('Interaction DateTime'),
      outcome: Joi.string().max(50).allow(null, '').label('Outcome'),
      summary: Joi.string().allow(null, '').label('Summary'),
      follow_up_required: Joi.boolean().allow(null).label('Follow Up Required'),
      follow_up_datetime: Joi.date().iso().allow(null).label('Follow Up DateTime'),
      follow_up_status: Joi.string().max(20).allow(null, '').label('Follow Up Status'),
      created_by: Joi.number().integer().allow(null).label('Created By')
    }).min(1).label('Update Data');

    let validatedUpdateData;

    // Validate update data
    try {
      logger.debug({ ...context, updateData }, 'Validating update data');
      validatedUpdateData = await updateSchema.validateAsync(updateData, {
        abortEarly: false,
        stripUnknown: true
      });
      logger.debug({ ...context, validatedUpdateData }, 'Update data validation passed');
    } catch (validationError) {
      const validationErrors = validationError.details?.map(detail => ({
        field: detail.context?.label || detail.path.join('.'),
        message: detail.message
      })) || [{ message: validationError.message }];

      logger.warn({ ...context, errors: validationErrors }, 'Validation failed for update data');
      throw new ValidationError(validationError.message);
    }

    const { sequelize } = inquiryInteractionDb;
    logger.debug(context, 'Starting database transaction');
    const transaction = await sequelize.transaction();

    try {
      
      const existingInteraction = await inquiryInteractionDb.getInquiryInteractionById({
        interactionId,
        logger,
        transaction // Pass transaction if the function supports it
      });

      if (!existingInteraction) {
        throw new NotFoundError('Inquiry interaction not found');
      }

      logger.debug({ 
        ...context, 
        existingInteractionId: existingInteraction.id,
        inquiryId: existingInteraction.inquiry_id 
      }, 'Interaction exists');

      // Validate created_by user exists if provided
      if (validatedUpdateData.created_by) {
        logger.debug({ ...context, userId: validatedUpdateData.created_by }, 'Validating user');
        
        // FIXED: Make sure this function exists and accepts transaction
        const user = await inquiryInteractionDb.getUserById({
          userId: validatedUpdateData.created_by,
          logger,
          transaction
        });

        if (!user) {
          throw new ValidationError('User not found with provided created_by');
        }

        logger.debug({ ...context, userName: user.full_name }, 'User validated');
      }

      // Update interaction
      const updatedInteraction = await inquiryInteractionDb.updateInquiryInteraction({
        interactionId,
        updateData: validatedUpdateData,
        transaction,
        logger
      });

      await transaction.commit();

      logger.info({
        ...context,
        interactionId: updatedInteraction.id,
        updatedFields: Object.keys(validatedUpdateData),
        transaction: 'committed'
      }, 'Inquiry interaction updated successfully');

      return updatedInteraction;
    } catch (error) {
      await transaction.rollback();
      logger.error({
        ...context,
        error: error.message,
        stack: error.stack,
        transaction: 'rolled back'
      }, 'Error in updateInquiryInteraction use case');

      if (error instanceof ValidationError || error.name === 'ValidationError') {
        throw error;
      }

      if (error instanceof NotFoundError) {
        throw error;
      }

      if (error.name === 'ForeignKeyError') {
        throw new ValidationError(error.message);
      }

      throw new UnknownError('Failed to update inquiry interaction');
    }
  };
};