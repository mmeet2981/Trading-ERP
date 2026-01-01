module.exports = function ({
    createErrorResponse,
    createSuccessResponse,
    getInquiryList
  }) {
    return async (req, res) => {
      const logger = req.log;
      const requestId = req.id || Date.now().toString();
      const context = { 
        requestId,
        operation: 'getInquiryListAction',
        method: req.method,
        url: req.url,
        ip: req.ip
      };
      
      try {
        logger.info(context, 'Received get inquiry list request');
        
        // Extract query parameters
        const {
          source,
          status,
          sla_status,
          customer_id,
          customer_name,
          customer_phone,
          customer_email,
          assigned_sales_person,
          product_requested,
          start_date,
          end_date,
          inquiry_date,
          sort_by = 'i.created_at',
          sort_order = 'desc',
          page = 1,
          limit = 50
        } = req.query;
  
        // Prepare filters object
        const filters = {};
        
        // Only add filters if they have values
        if (source) filters.source = source;
        if (status) filters.status = status;
        if (sla_status) filters.sla_status = sla_status;
        if (customer_id) filters.customer_id = parseInt(customer_id);
        if (customer_name) filters.customer_name = customer_name;
        if (customer_phone) filters.customer_phone = customer_phone;
        if (customer_email) filters.customer_email = customer_email;
        if (assigned_sales_person) filters.assigned_sales_person = parseInt(assigned_sales_person);
        if (product_requested) filters.product_requested = product_requested;
        if (start_date) filters.start_date = start_date;
        if (end_date) filters.end_date = end_date;
        if (inquiry_date) filters.inquiry_date = inquiry_date;
        
        filters.sort_by = sort_by;
        filters.sort_order = sort_order;
  
        // Prepare pagination
        const pagination = {
          page: parseInt(page),
          limit: parseInt(limit)
        };
  
        logger.debug({ 
          ...context, 
          filters,
          pagination 
        }, 'Extracted filters and pagination');
  
        // Call use case
        const result = await getInquiryList({
          filters,
          pagination,
          logger: logger.child({ module: 'inquiryListUsecase', requestId })
        });
  
        // Format the response to show contact_info based on source
        const formattedInquiries = result.inquiries.map(inquiry => {
          const formattedInquiry = {
            id: inquiry.id,
            inquiry_code: inquiry.inquiry_code,
            inquiry_datetime: inquiry.inquiry_datetime,
            created_at: inquiry.created_at,
            source: inquiry.source,
            status: inquiry.status,
            sla_status: inquiry.sla_status,
            assigned_sales_person: inquiry.assigned_sales_person,
            assigned_user_name: inquiry.assigned_user_name,
            assigned_user_code: inquiry.assigned_user_code,
            customer_name: inquiry.customer_name,
            product_requested: inquiry.product_requested,
            expected_price: inquiry.expected_price,
            expected_delivery_date: inquiry.expected_delivery_date
          };
  
          // Add contact_info based on source
          switch(inquiry.source) {
            case 'PHONE':
              formattedInquiry.contact_info = {
                type: 'phone',
                value: inquiry.customer_phone
              };
              break;
            case 'EMAIL':
              formattedInquiry.contact_info = {
                type: 'email',
                value: inquiry.customer_email
              };
              break;
            case 'WHATSAPP':
              formattedInquiry.contact_info = {
                type: 'whatsapp',
                value: inquiry.customer_whatsapp || inquiry.customer_phone
              };
              break;
            case 'WEBSITE':
              formattedInquiry.contact_info = {
                type: 'email',
                value: inquiry.customer_email
              };
              break;
            case 'SMS':
              formattedInquiry.contact_info = {
                type: 'phone',
                value: inquiry.customer_phone
              };
              break;
            default:
              formattedInquiry.contact_info = {
                type: inquiry.customer_phone ? 'phone' : 'email',
                value: inquiry.customer_phone || inquiry.customer_email
              };
          }
  
          return formattedInquiry;
        });
  
        logger.info({ 
          ...context, 
          count: formattedInquiries.length,
          total: result.pagination.total,
          page: result.pagination.page 
        }, 'Inquiry list retrieved successfully');
  
        // Send success response
        createSuccessResponse(
          200,
          {
            message: 'Inquiry list retrieved successfully',
            data: formattedInquiries,
            pagination: result.pagination,
            filters: Object.keys(filters).length > 0 ? filters : undefined
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
          logger.warn(errorContext, 'Validation error in get inquiry list');
        } else {
          logger.error(errorContext, 'Error in getInquiryListAction');
        }
        
        createErrorResponse(error, res);
      }
    };
  };