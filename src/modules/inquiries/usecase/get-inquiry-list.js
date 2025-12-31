module.exports = function ({
    inquiryDb,
    UnknownError,
    ValidationError,
    Joi
  }) {
    return async ({
      filters = {},
      pagination = {},
      logger
    }) => {
      const context = { 
        operation: 'getInquiryList',
        filters,
        pagination
      };
      
      logger.info(context, 'Processing get inquiry list request');
  
      // Validation schema for filters
      const filtersSchema = Joi.object({
        // Basic filters
        source: Joi.string().valid('PHONE', 'EMAIL', 'WHATSAPP', 'WEBSITE', 'SMS', 'SOCIAL_MEDIA', 'WALKIN', 'REFERRAL', 'OTHER'),
        status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED', 'FOLLOW_UP'),
        sla_status: Joi.string().valid('PENDING', 'ON_TRACK', 'AT_RISK', 'BREACHED', 'COMPLETED'),
        
        // Customer filters
        customer_id: Joi.number().integer().min(1),
        customer_name: Joi.string().max(150),
        customer_phone: Joi.string().max(20),
        customer_email: Joi.string().email().max(120),
        
        // Assignment filters
        assigned_sales_person: Joi.number().integer().min(1),
        
        // Product filters
        product_requested: Joi.string().max(150),
        
        // Date filters
        start_date: Joi.date().iso(),
        end_date: Joi.date().iso().min(Joi.ref('start_date')),
        inquiry_date: Joi.date().iso(),
        
        // Sorting
        sort_by: Joi.string().valid(
          'i.created_at', 'i.inquiry_datetime', 'i.inquiry_code', 
          'c.name', 'i.status', 'i.sla_status'
        ),
        sort_order: Joi.string().valid('asc', 'desc')
      });
  
      // Validation schema for pagination
      const paginationSchema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(50)
      });
  
      // Validate filters and pagination
      try {
        logger.debug({ ...context }, 'Validating filters and pagination');
        
        const validatedFilters = await filtersSchema.validateAsync(filters, { abortEarly: false });
        const validatedPagination = await paginationSchema.validateAsync(pagination, { abortEarly: false });
        
        // Calculate offset from page and limit
        const offset = (validatedPagination.page - 1) * validatedPagination.limit;
        
        const paginationParams = {
          limit: validatedPagination.limit,
          offset: offset
        };
  
        logger.debug({ 
          ...context, 
          validatedFilters, 
          paginationParams 
        }, 'Validation passed, fetching data');
  
        // Call data access layer
        const result = await inquiryDb.getInquiryList({
          filters: validatedFilters,
          pagination: paginationParams,
          logger
        });
  
        logger.info({ 
          ...context, 
          count: result.inquiries.length,
          total: result.pagination.total 
        }, 'Inquiry list fetched successfully');
  
        return result;
      } catch (validationError) {
        const validationErrors = validationError.details?.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        })) || [{ message: validationError.message }];
        
        logger.warn({ ...context, errors: validationErrors }, 'Validation failed for inquiry list');
        throw new ValidationError(validationError.message);
      }
    };
  };