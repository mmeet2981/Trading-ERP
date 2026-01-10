module.exports = function ({
    createErrorResponse,
    createSuccessResponse,
    updateInquiry
  }) {
    return async (req, res) => {
      const logger = req.log;
      const requestId = req.id || Date.now().toString();
      const context = { 
        requestId,
        operation: 'updateInquiryAction',
        method: req.method,
        url: req.url,
        ip: req.ip
      };
      
      try {
        logger.info(context, 'Received update inquiry request');
        
        // Extract inquiry ID from URL parameters
        const inquiryId = parseInt(req.params.id);
        
        if (!inquiryId || isNaN(inquiryId)) {
          logger.warn({ ...context, inquiryId: req.params.id }, 'Invalid inquiry ID');
          throw new ValidationError('Valid inquiry ID is required');
        }
        
        // Extract update data from request body
        const updateData = {
          source: req.body.source,
          source_reference: req.body.source_reference,
          linked_order_id: req.body.linked_order_id,
          status: req.body.status,
          product_requested: req.body.product_requested,
          expected_price: req.body.expected_price,
          expected_delivery_date: req.body.expected_delivery_date,
          quantity: req.body.quantity,
          uom: req.body.uom,
          special_instructions: req.body.special_instructions,
          transcript: req.body.transcript,
          assigned_sales_person: req.body.assigned_sales_person,
          is_within_working_hours: req.body.is_within_working_hours,
          interaction_due_time: req.body.interaction_due_time,
          sla_status: req.body.sla_status,
          customer_id: req.body.customer_id
        };
        
        // Add customer details if provided
        if (req.body.customer_name || req.body.customer_phone_number || req.body.customer_email) {
          updateData.customer = {
            name: req.body.customer_name,
            poc_name: req.body.customer_poc_name,
            phone_number: req.body.customer_phone_number,
            whatsapp_number: req.body.customer_whatsapp_number,
            email: req.body.customer_email,
            address: req.body.customer_address,
            preferred_contact_method: req.body.customer_preferred_contact_method
          };
        }
        
        // Remove undefined/null values
        Object.keys(updateData).forEach(key => {
          if (updateData[key] === undefined || updateData[key] === null) {
            delete updateData[key];
          }
        });
        
        // Also clean customer object if all its fields are undefined/null
        if (updateData.customer) {
          const customerKeys = Object.keys(updateData.customer);
          const hasCustomerData = customerKeys.some(key => updateData.customer[key] !== undefined && updateData.customer[key] !== null);
          
          if (!hasCustomerData) {
            delete updateData.customer;
          }
        }
        
        logger.debug({ 
          ...context, 
          inquiryId, 
          updateData 
        }, 'Extracted update data');
  
        // Check if update data is empty
        if (Object.keys(updateData).length === 0) {
          logger.warn(context, 'No update data provided');
          throw new ValidationError('No fields to update provided');
        }
  
        // Call use case
        const result = await updateInquiry({
          inquiryId,
          updateData,
          logger: logger.child({ module: 'updateInquiryUsecase', requestId })
        });
  
        logger.info({ 
          ...context, 
          inquiryId: result.id,
          inquiryCode: result.inquiry_code,
          statusCode: 200 
        }, 'Inquiry updated successfully');
  
        // Send success response
        createSuccessResponse(
          200,
          {
            message: 'Inquiry updated successfully',
            data: {
              id: result.id,
              inquiry_code: result.inquiry_code,
              inquiry_datetime: result.inquiry_datetime,
              source: result.source,
              status: result.status,
              product_requested: result.product_requested,
              expected_price: result.expected_price,
              expected_delivery_date: result.expected_delivery_date,
              quantity: result.quantity,
              uom: result.uom,
              special_instructions: result.special_instructions,
              sla_status: result.sla_status,
              assigned_sales_person: result.assigned_sales_person,
              updated_at: result.updated_at,
              customer_details: result.customer_details
            }
          },
          res
        );
      } catch (error) {
        const errorContext = {
          ...context,
          error: error.message,
          errorName: error.name,
          statusCode: error.statusCode || 500
        };
        
        if (error.name === 'ValidationError') {
          logger.warn(errorContext, 'Validation error in update inquiry');
        } else if (error.name === 'NotFoundError') {
          logger.warn(errorContext, 'Inquiry not found for update');
        } else {
          logger.error(errorContext, 'Error in updateInquiryAction');
        }
        
        createErrorResponse(error, res);
      }
    };
  };