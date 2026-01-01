module.exports = function ({
  inquiryDb,
  UnknownError,
  ValidationError,
  Joi
}) {
  return async ({
    inquiryData,
    logger
  }) => {
    const context = { 
      operation: 'createInquiry',
      source: inquiryData.source,
      phoneNumber: inquiryData.customer?.phone_number,
      email: inquiryData.customer?.email
    };
    
    logger.info(context, 'Starting inquiry creation process');

    // Customer validation schema
    const customerSchema = Joi.object({
      name: Joi.string().max(150).required().label('Customer Name'),
      poc_name: Joi.string().max(150).allow(null, '').label('Point of Contact'),
      phone_number: Joi.string().max(20).allow(null, '').label('Phone Number'),
      whatsapp_number: Joi.string().max(20).allow(null, '').label('WhatsApp Number'),
      email: Joi.string().email().max(120).allow(null, '').label('Email'),
      address: Joi.string().allow(null, '').label('Address'),
      preferred_contact_method: Joi.string().max(20).allow(null, '').label('Preferred Contact Method')
    }).custom((value, helpers) => {
      // Custom validation: At least phone number OR email must be provided
      if (!value.phone_number && !value.email) {
        return helpers.error('any.custom', {
          message: 'Either phone number or email must be provided for customer identification'
        });
      }
      return value;
    }).label('Customer Data');

    // Inquiry validation schema - only customer details approach
    const inquirySchema = Joi.object({
      source: Joi.string().max(30).required().label('Inquiry Source'),
      source_reference: Joi.string().max(100).allow(null, '').label('Source Reference'),
      linked_order_id: Joi.number().integer().allow(null).label('Linked Order ID'),
      customer: customerSchema.required().label('Customer Details'),
      product_requested: Joi.string().max(150).required().label('Product Requested'),
      expected_price: Joi.number().precision(2).min(0).allow(null).label('Expected Price'),
      expected_delivery_date: Joi.date().iso().greater('now').allow(null).label('Expected Delivery Date'),
      quantity: Joi.number().precision(2).min(0).allow(null).label('Quantity'),
      uom: Joi.string().max(20).allow(null, '').label('Unit of Measure'),
      special_instructions: Joi.string().allow(null, '').label('Special Instructions'),
      transcript: Joi.string().allow(null, '').label('Transcript'),
      assigned_sales_person: Joi.number().integer().allow(null).label('Assigned Sales Person'),
      is_within_working_hours: Joi.boolean().allow(null).label('Within Working Hours'),
      interaction_due_time: Joi.date().iso().allow(null).label('Interaction Due Time'),
      sla_status: Joi.string().max(20).allow(null, '').label('SLA Status')
    }).label('Inquiry Data');

    // Validate input
    try {
      logger.debug({ ...context, data: inquiryData }, 'Validating inquiry data');
      await inquirySchema.validateAsync(inquiryData, { abortEarly: false });
      logger.debug(context, 'Inquiry data validation passed');
    } catch (validationError) {
      const validationErrors = validationError.details?.map(detail => ({
        field: detail.context?.label || detail.path.join('.'),
        message: detail.message
      })) || [{ message: validationError.message }];
      
      logger.warn({ ...context, errors: validationErrors }, 'Validation failed');
      throw new ValidationError(validationError.message);
    }

    // Get sequelize instance from inquiryDb
    const { sequelize } = inquiryDb;
    
    // Start transaction
    logger.debug(context, 'Starting database transaction');
    const transaction = await sequelize.transaction();

    try {
      // Find or create customer by phone/email
      logger.info({ 
        ...context, 
        phone: inquiryData.customer.phone_number,
        email: inquiryData.customer.email 
      }, 'Finding or creating customer');
      
      const customer = await inquiryDb.findOrCreateCustomer({
        customerData: inquiryData.customer,
        transaction,
        logger
      });
      
      const customerAction = customer.id ? 'found' : 'created';
      logger.info({ 
        ...context, 
        customerId: customer.id, 
        action: customerAction,
        customerName: customer.name 
      }, `Customer ${customerAction}`);

      // Validate assigned sales person exists if provided
      if (inquiryData.assigned_sales_person) {
        logger.debug({ ...context, salesPersonId: inquiryData.assigned_sales_person }, 'Validating sales person');
        
        const salesPerson = await inquiryDb.getUserById({
          userId: inquiryData.assigned_sales_person,
          logger,
          transaction
        });

        if (!salesPerson) {
          logger.warn({ ...context, salesPersonId: inquiryData.assigned_sales_person }, 'Sales person not found');
          throw new ValidationError('Assigned sales person not found');
        }
        
        logger.debug({ ...context, salesPersonName: salesPerson.full_name }, 'Sales person validated');
      }

      // Generate inquiry code
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
      const count = await inquiryDb.getInquiryCountForToday({ logger, transaction });
      const nextNumber = (count + 1).toString().padStart(4, '0');
      const inquiryCode = `INQ-${dateStr}-${nextNumber}`;
      
      logger.debug({ 
        ...context, 
        dateStr, 
        count, 
        nextNumber, 
        inquiryCode 
      }, 'Generated inquiry code');

      // Prepare inquiry data for DB
      const dbInquiryData = {
        inquiry_code: inquiryCode,
        inquiry_datetime: new Date(),
        source: inquiryData.source,
        source_reference: inquiryData.source_reference || null,
        linked_order_id: inquiryData.linked_order_id || null,
        status: 'OPEN',
        customer_id: customer.id,
        product_requested: inquiryData.product_requested,
        expected_price: inquiryData.expected_price || null,
        expected_delivery_date: inquiryData.expected_delivery_date || null,
        quantity: inquiryData.quantity || null,
        uom: inquiryData.uom || null,
        special_instructions: inquiryData.special_instructions || null,
        transcript: inquiryData.transcript || null,
        assigned_sales_person: inquiryData.assigned_sales_person || null,
        is_within_working_hours: inquiryData.is_within_working_hours || null,
        interaction_due_time: inquiryData.interaction_due_time || null,
        sla_status: inquiryData.sla_status || 'PENDING'
      };

      logger.debug({ ...context, inquiryData: dbInquiryData }, 'Prepared inquiry data for DB');

      // Create inquiry
      const result = await inquiryDb.createInquiry({
        inquiryData: dbInquiryData,
        transaction,
        logger
      });

      // Commit transaction
      await transaction.commit();
      logger.info({ 
        ...context, 
        inquiryId: result.id,
        inquiryCode: result.inquiry_code,
        customerId: customer.id,
        customerAction,
        transaction: 'committed'
      }, 'Inquiry created successfully');
      
      return {
        ...result,
        customer_details: {
          id: customer.id,
          name: customer.name,
          phone_number: customer.phone_number,
          email: customer.email,
          action: customerAction
        }
      };
    } catch (error) {
      // Rollback transaction on error
      await transaction.rollback();
      logger.error({ 
        ...context, 
        error: error.message, 
        stack: error.stack,
        transaction: 'rolled back'
      }, 'Error in createInquiry use case');
      
      if (error instanceof ValidationError || error.name === 'ValidationError') {
        throw error;
      }
      
      if (error.name === 'UniqueConstraintError') {
        throw new ValidationError(error.message);
      }
      
      throw new UnknownError('Failed to create inquiry');
    }
  };
};