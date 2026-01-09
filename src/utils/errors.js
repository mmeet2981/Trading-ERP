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

class BadRequestError extends BaseError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

class AuthenticationError extends BaseError {
  constructor(message = 'Authentication Failed') {
    super(message, 401);
  }
}

class AuthorizationError extends BaseError {
  constructor(message = 'Access Denied') {
    super(message, 403);
  }
}

class NotFoundError extends BaseError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, 409);
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
  BadRequestError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  UnknownError
};
