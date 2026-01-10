module.exports = function ({
    inquiryDb,
    UnknownError,
    NotFoundError,
    ValidationError,
    Joi
  }) {
    return async ({
      inquiryId,
      updateData,
      logger
    }) => {
      const context = { 
        operation: 'updateInquiry',
        inquiryId,
        updateFields: Object.keys(updateData)
      };
      
      logger.info(context, 'Processing update inquiry request');
  
      // Validation schema for update data
      const updateSchema = Joi.object({
        // Inquiry details that can be updated
        source: Joi.string().valid('PHONE', 'EMAIL', 'WHATSAPP'),
        source_reference: Joi.string().max(100).allow(null, '').label('Source Reference'),
        linked_order_id: Joi.number().integer().allow(null).label('Linked Order ID'),
        status: Joi.string().valid('OPEN', 'IN_PROGRESS', 'CLOSED', 'CANCELLED', 'FOLLOW_UP').label('Status'),
        product_requested: Joi.string().max(150).label('Product Requested'),
        expected_price: Joi.number().precision(2).min(0).allow(null).label('Expected Price'),
        expected_delivery_date: Joi.date().iso().allow(null).label('Expected Delivery Date'),
        quantity: Joi.number().precision(2).min(0).allow(null).label('Quantity'),
        uom: Joi.string().max(20).allow(null, '').label('Unit of Measure'),
        special_instructions: Joi.string().allow(null, '').label('Special Instructions'),
        transcript: Joi.string().allow(null, '').label('Transcript'),
        
        // Assignment and timing
        assigned_sales_person: Joi.number().integer().allow(null).label('Assigned Sales Person'),
        is_within_working_hours: Joi.boolean().allow(null).label('Within Working Hours'),
        interaction_due_time: Joi.date().iso().allow(null).label('Interaction Due Time'),
        sla_status: Joi.string().valid('PENDING', 'ON_TRACK', 'AT_RISK', 'BREACHED', 'COMPLETED').allow(null, '').label('SLA Status'),
        
        // Customer can be updated by providing customer_id OR customer details
        customer_id: Joi.number().integer().allow(null).label('Customer ID'),
        customer: Joi.object({
          name: Joi.string().max(150).allow(null, '').label('Customer Name'),
          poc_name: Joi.string().max(150).allow(null, '').label('Point of Contact'),
          phone_number: Joi.string().max(20).allow(null, '').label('Phone Number'),
          whatsapp_number: Joi.string().max(20).allow(null, '').label('WhatsApp Number'),
          email: Joi.string().email().max(120).allow(null, '').label('Email'),
          address: Joi.string().allow(null, '').label('Address'),
          preferred_contact_method: Joi.string().max(20).allow(null, '').label('Preferred Contact Method')
        }).label('Customer Details')
      }).min(1).label('Update Data'); // At least one field must be provided
  
      // Validate update data
      try {
        logger.debug({ ...context, updateData }, 'Validating update data');
        
        const validatedUpdateData = await updateSchema.validateAsync(updateData, { 
          abortEarly: false,
          stripUnknown: true // Remove unknown fields
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
  
      // Get sequelize instance from inquiryDb
      const { sequelize } = inquiryDb;
      
      // Start transaction
      logger.debug(context, 'Starting database transaction');
      const transaction = await sequelize.transaction();
  
      try {
        // Validate inquiry exists
        const existingInquiry = await inquiryDb.validateInquiryExists({
          inquiryId,
          transaction,
          logger
        });
  
        // Prepare update data for inquiry table
        const inquiryUpdateData = { ...updateData };
        let customer = null;
        
        // Handle customer update if provided
        if (updateData.customer || updateData.customer_id) {
          // If customer_id is provided directly, use it
          if (updateData.customer_id) {
            logger.debug({ ...context, customerId: updateData.customer_id }, 'Validating provided customer_id');
            
            customer = await inquiryDb.getCustomerById({
              customerId: updateData.customer_id,
              logger,
              transaction
            });
  
            if (!customer) {
              throw new ValidationError('Customer not found with provided customer_id');
            }
            
            inquiryUpdateData.customer_id = updateData.customer_id;
            logger.info({ ...context, customerId: customer.id, customerName: customer.name }, 'Using provided customer ID');
          }
          // If customer details are provided, find or create customer
          else if (updateData.customer) {
            logger.info({ ...context, customerData: updateData.customer }, 'Finding or creating customer for update');
            
            customer = await inquiryDb.findOrCreateCustomer({
              customerData: updateData.customer,
              transaction,
              logger
            });
            
            inquiryUpdateData.customer_id = customer.id;
            logger.info({ ...context, customerId: customer.id, customerName: customer.name }, 'Updated customer for inquiry');
          }
          
          // Remove customer object from update data as it's not a column in inquiries table
          delete inquiryUpdateData.customer;
        }
  
        // Validate assigned sales person exists if provided
        if (updateData.assigned_sales_person) {
          logger.debug({ ...context, salesPersonId: updateData.assigned_sales_person }, 'Validating assigned sales person');
          
          const salesPerson = await inquiryDb.getUserById({
            userId: updateData.assigned_sales_person,
            logger,
            transaction
          });
  
          if (!salesPerson) {
            throw new ValidationError('Assigned sales person not found');
          }
          
          logger.debug({ ...context, salesPersonName: salesPerson.full_name }, 'Sales person validated');
        }
  
        // Check if status is being updated
        if (updateData.status && updateData.status !== existingInquiry.status) {
          logger.info({ 
            ...context, 
            oldStatus: existingInquiry.status, 
            newStatus: updateData.status 
          }, 'Inquiry status updated');
          
          // You could add business logic here for status transitions
          // For example: validate allowed status transitions
          const allowedTransitions = {
            'OPEN': ['IN_PROGRESS', 'CLOSED', 'CANCELLED'],
            'IN_PROGRESS': ['CLOSED', 'FOLLOW_UP', 'CANCELLED'],
            'FOLLOW_UP': ['IN_PROGRESS', 'CLOSED'],
            'CLOSED': [],
            'CANCELLED': []
          };
          
          if (allowedTransitions[existingInquiry.status] && 
              !allowedTransitions[existingInquiry.status].includes(updateData.status)) {
            throw new ValidationError(`Invalid status transition from ${existingInquiry.status} to ${updateData.status}`);
          }
        }
  
        // Update inquiry
        const updatedInquiry = await inquiryDb.updateInquiry({
          inquiryId,
          updateData: inquiryUpdateData,
          transaction,
          logger
        });
  
        // Commit transaction
        await transaction.commit();
        
        logger.info({ 
          ...context, 
          inquiryId: updatedInquiry.id,
          inquiryCode: updatedInquiry.inquiry_code,
          updatedFields: Object.keys(inquiryUpdateData),
          transaction: 'committed'
        }, 'Inquiry updated successfully');
        
        // Return updated inquiry with customer details if customer was updated
        const result = {
          ...updatedInquiry
        };
        
        if (customer) {
          result.customer_details = {
            id: customer.id,
            name: customer.name,
            phone_number: customer.phone_number,
            email: customer.email,
            action: customer.id ? 'updated' : 'created'
          };
        }
        
        return result;
      } catch (error) {
        // Rollback transaction on error
        await transaction.rollback();
        logger.error({ 
          ...context, 
          error: error.message, 
          stack: error.stack,
          transaction: 'rolled back'
        }, 'Error in updateInquiry use case');
        
        if (error instanceof ValidationError || error.name === 'ValidationError') {
          throw error;
        }
        
        if (error instanceof NotFoundError) {
          throw error;
        }
        
        if (error.name === 'UniqueConstraintError' || error.name === 'ForeignKeyError') {
          throw new ValidationError(error.message);
        }
        
        throw new UnknownError('Failed to update inquiry');
      }
    };
  };