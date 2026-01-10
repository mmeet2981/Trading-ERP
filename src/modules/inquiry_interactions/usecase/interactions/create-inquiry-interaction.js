module.exports = function ({
  inquiryInteractionDb,
  UnknownError,
  ValidationError,
  NotFoundError,
  Joi
}) {
  return async ({
    interactionData,
    logger
  }) => {
    const context = { 
      operation: 'createInquiryInteraction',
      inquiryId: interactionData.inquiry_id,
      interactionType: interactionData.interaction_type
    };
    
    logger.info(context, 'Starting inquiry interaction creation process');

    // Validation schema for interaction data
    const interactionSchema = Joi.object({
      inquiry_id: Joi.number().integer().required().label('Inquiry ID'),
      interaction_type: Joi.string().max(30).required().label('Interaction Type'),
      interaction_datetime: Joi.date().iso().allow(null).label('Interaction DateTime'),
      outcome: Joi.string().max(50).allow(null, '').label('Outcome'),
      summary: Joi.string().allow(null, '').label('Summary'),
      follow_up_required: Joi.boolean().allow(null).label('Follow Up Required'),
      follow_up_datetime: Joi.date().iso().allow(null).label('Follow Up DateTime'),
      follow_up_status: Joi.string().max(20).allow(null, '').label('Follow Up Status'),
      created_by: Joi.number().integer().allow(null).label('Created By')
    }).label('Interaction Data');

    // Validate input
    try {
      logger.debug({ ...context, data: interactionData }, 'Validating interaction data');
      await interactionSchema.validateAsync(interactionData, { abortEarly: false });
      logger.debug(context, 'Interaction data validation passed');
    } catch (validationError) {
      const validationErrors = validationError.details?.map(detail => ({
        field: detail.context?.label || detail.path.join('.'),
        message: detail.message
      })) || [{ message: validationError.message }];
      
      logger.warn({ ...context, errors: validationErrors }, 'Validation failed');
      throw new ValidationError(validationError.message);
    }

    // Get sequelize instance from inquiryInteractionDb
    const { sequelize } = inquiryInteractionDb;
    
    // Start transaction
    logger.debug(context, 'Starting database transaction');
    const transaction = await sequelize.transaction();

    try {
      // Validate inquiry exists
      logger.debug({ ...context, inquiryId: interactionData.inquiry_id }, 'Validating inquiry exists');
      
      const inquiry = await inquiryInteractionDb.validateInquiryExists({
        inquiryId: interactionData.inquiry_id,
        transaction,
        logger
      });

      logger.info({ 
        ...context, 
        inquiryCode: inquiry.inquiry_code,
        inquiryStatus: inquiry.status 
      }, 'Inquiry validated');

      // Validate created_by user exists if provided
      if (interactionData.created_by) {
        logger.debug({ ...context, userId: interactionData.created_by }, 'Validating user');
        
        const user = await inquiryInteractionDb.getUserById({
          userId: interactionData.created_by,
          logger,
          transaction
        });

        if (!user) {
          logger.warn({ ...context, userId: interactionData.created_by }, 'User not found');
          throw new ValidationError('User not found with provided created_by');
        }
        
        logger.debug({ ...context, userName: user.full_name }, 'User validated');
      }

      // Prepare interaction data for DB
      const dbInteractionData = {
        inquiry_id: interactionData.inquiry_id,
        interaction_type: interactionData.interaction_type,
        interaction_datetime: interactionData.interaction_datetime || new Date(),
        outcome: interactionData.outcome || null,
        summary: interactionData.summary || null,
        follow_up_required: interactionData.follow_up_required || false,
        follow_up_datetime: interactionData.follow_up_datetime || null,
        follow_up_status: interactionData.follow_up_status || null,
        created_by: interactionData.created_by || null
      };

      logger.debug({ ...context, interactionData: dbInteractionData }, 'Prepared interaction data for DB');

      // Create interaction
      const result = await inquiryInteractionDb.createInquiryInteraction({
        interactionData: dbInteractionData,
        transaction,
        logger
      });

      // Commit transaction
      await transaction.commit();
      logger.info({ 
        ...context, 
        interactionId: result.id,
        inquiryId: result.inquiry_id,
        transaction: 'committed'
      }, 'Inquiry interaction created successfully');
      
      return result;
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      logger.error({ 
        ...context, 
        error: error.message, 
        stack: error.stack,
        transaction: 'rolled back'
      }, 'Error in createInquiryInteraction use case');
      
      if (error instanceof ValidationError || error.name === 'ValidationError') {
        throw error;
      }
      
      if (error instanceof NotFoundError) {
        throw error;
      }
      
      if (error.name === 'ForeignKeyError') {
        throw new ValidationError(error.message);
      }
      
      throw new UnknownError('Failed to create inquiry interaction');
    }
  };
};

