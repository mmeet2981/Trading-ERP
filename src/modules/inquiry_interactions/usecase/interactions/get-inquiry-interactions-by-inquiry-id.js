module.exports = function ({
  inquiryInteractionDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
}) {
  return async ({
    inquiryId,
    filters = {},
    pagination = {},
    logger
  }) => {
    const context = { 
      operation: 'getInquiryInteractionsById',
      inquiryId,
      filters,
      pagination
    };
    
    logger.info(context, 'Processing get inquiry interactions by ID request');

    // Validation schema for filters
    const filtersSchema = Joi.object({
      // Interaction filters
      interaction_type: Joi.string().valid('CALL', 'EMAIL', 'MEETING', 'WHATSAPP', 'SMS', 'FOLLOW_UP', 'OTHER').label('Interaction Type'),
      outcome: Joi.string().max(50).label('Outcome'),
      follow_up_status: Joi.string().max(20).label('Follow Up Status'),
      follow_up_required: Joi.boolean().label('Follow Up Required'),
      created_by: Joi.number().integer().min(1).label('Created By User ID'),
      
      // Date filters
      start_date: Joi.date().iso().label('Start Date'),
      end_date: Joi.date().iso().min(Joi.ref('start_date')).label('End Date'),
      interaction_date: Joi.date().iso().label('Interaction Date'),
      
      // Sorting
      sort_by: Joi.string().valid(
        'ii.interaction_datetime', 'ii.created_at', 
        'ii.interaction_type', 'ii.outcome'
      ),
      sort_order: Joi.string().valid('asc', 'desc')
    });

    // Validation schema for pagination
    const paginationSchema = Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20)
    });

    // Validation schema for inquiryId
    const paramsSchema = Joi.object({
      inquiryId: Joi.number().integer().min(1).required().label('Inquiry ID')
    });

    // Validate parameters
    try {
      logger.debug({ ...context }, 'Validating parameters');
      
      // Validate inquiryId
      const validatedParams = await paramsSchema.validateAsync({ inquiryId }, { abortEarly: false });
      
      // Validate filters
      const validatedFilters = await filtersSchema.validateAsync(filters, { abortEarly: false });
      
      // Validate pagination
      const validatedPagination = await paginationSchema.validateAsync(pagination, { abortEarly: false });
      
      // Calculate offset from page and limit
      const offset = (validatedPagination.page - 1) * validatedPagination.limit;
      
      const paginationParams = {
        limit: validatedPagination.limit,
        offset: offset
      };

      logger.debug({ 
        ...context, 
        validatedParams,
        validatedFilters, 
        paginationParams 
      }, 'Validation passed, fetching data');

      // First, validate that the inquiry exists
      const inquiry = await inquiryInteractionDb.validateInquiryExists({
        inquiryId: validatedParams.inquiryId,
        logger,
        transaction: null // No transaction needed for read
      });

      logger.debug({ ...context, inquiryCode: inquiry.inquiry_code, inquiryStatus: inquiry.status }, 'Inquiry exists');

      // Call data access layer
      const result = await inquiryInteractionDb.getInquiryInteractionsByInquiryId({
        inquiryId: validatedParams.inquiryId,
        filters: validatedFilters,
        pagination: paginationParams,
        logger
      });

      logger.info({ 
        ...context, 
        count: result.interactions.length,
        total: result.pagination.total,
        inquiryCode: inquiry.inquiry_code 
      }, 'Inquiry interactions fetched successfully');

      return {
        ...result,
        inquiry_details: {
          id: inquiry.id,
          inquiry_code: inquiry.inquiry_code,
          status: inquiry.status
        }
      };
    } catch (validationError) {
      const validationErrors = validationError.details?.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      })) || [{ message: validationError.message }];
      
      logger.warn({ ...context, errors: validationErrors }, 'Validation failed for get inquiry interactions');
      throw new ValidationError(validationError.message);
    }
  };
};