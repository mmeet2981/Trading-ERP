module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  createInquiry
}) {
  return async (req, res) => {
    const logger = req.log;
    const requestId = req.id || Date.now().toString();
    const context = { 
      requestId,
      operation: 'createInquiryAction',
      method: req.method,
      url: req.url,
      ip: req.ip
    };
    
    try {
      logger.info(context, 'Received create inquiry request');
      
      // Extract customer details from request body (phone/email based approach)
      const customerData = {
        name: req.body.customer_name,
        poc_name: req.body.customer_poc_name,
        phone_number: req.body.customer_phone_number,
        whatsapp_number: req.body.customer_whatsapp_number,
        email: req.body.customer_email,
        address: req.body.customer_address,
        preferred_contact_method: req.body.customer_preferred_contact_method
      };
      
      // Log the customer identification method
      if (customerData.phone_number) {
        logger.debug({ 
          ...context, 
          identification: 'phone_number',
          phone: customerData.phone_number 
        }, 'Customer identification by phone number');
      } else if (customerData.email) {
        logger.debug({ 
          ...context, 
          identification: 'email',
          email: customerData.email 
        }, 'Customer identification by email');
      }
      
      // Extract inquiry data from request body
      const inquiryData = {
        source: req.body.source,
        source_reference: req.body.source_reference,
        linked_order_id: req.body.linked_order_id,
        customer: customerData,
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
        sla_status: req.body.sla_status
      };

      logger.debug({ ...context, inquiryData }, 'Prepared inquiry data for use case');

      // Call use case
      const result = await createInquiry({
        inquiryData,
        logger: logger.child({ module: 'inquiryUsecase', requestId })
      });

      logger.info({ 
        ...context, 
        inquiryId: result.id,
        inquiryCode: result.inquiry_code,
        customerId: result.customer_details.id,
        customerAction: result.customer_details.action,
        statusCode: 201
      }, 'Inquiry created successfully');

      // Send success response
      createSuccessResponse(
        201,
        {
          message: 'Inquiry created successfully',
          inquiry: {
            id: result.id,
            inquiry_code: result.inquiry_code,
            inquiry_datetime: result.inquiry_datetime,
            source: result.source,
            status: result.status,
            product_requested: result.product_requested,
            expected_price: result.expected_price,
            expected_delivery_date: result.expected_delivery_date,
            quantity: result.quantity,
            uom: result.uom
          },
          customer: {
            id: result.customer_details.id,
            name: result.customer_details.name,
            phone_number: result.customer_details.phone_number,
            email: result.customer_details.email,
            action: result.customer_details.action // 'found' or 'created'
          },
          inquiry_code: result.inquiry_code
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
        logger.warn(errorContext, 'Validation error in create inquiry');
      } else {
        logger.error(errorContext, 'Error in createInquiryAction');
      }
      
      createErrorResponse(error, res);
    }
  };
};