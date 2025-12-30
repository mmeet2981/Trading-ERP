const createSuccessResponse = (statusCode, data, res) => {
    return res.status(statusCode).json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  };
  
  const createErrorResponse = (error, res) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
  
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        code: error.name || 'UNKNOWN_ERROR'
      },
      timestamp: new Date().toISOString()
    });
  };
  
  module.exports = {
    createSuccessResponse,
    createErrorResponse
  };