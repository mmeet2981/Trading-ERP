const createSuccessResponse = (statusCode, data, res) => {
  const response = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    requestId: res.req?.id || null
  };

  res.status(statusCode).json(response);
};

const createErrorResponse = (error, res) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  const response = {
    success: false,
    error: {
      message,
      code: error.name || 'UNKNOWN_ERROR'
    },
    timestamp: new Date().toISOString(),
    requestId: res.req?.id || null
  };

  // Add validation errors if available
  if (error.details) {
    response.error.details = error.details;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  createSuccessResponse,
  createErrorResponse
};