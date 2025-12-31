class BaseError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.name = this.constructor.name;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class ValidationError extends BaseError {
    constructor(message = 'Validation Error') {
      super(message, 400);
    }
  }
  
  class NotFoundError extends BaseError {
    constructor(message = 'Resource Not Found') {
      super(message, 404);
    }
  }
  
  class UnknownError extends BaseError {
    constructor(message = 'Unknown Error') {
      super(message, 500);
    }
  }
  
  module.exports = {
    BaseError,
    ValidationError,
    NotFoundError,
    UnknownError
  };