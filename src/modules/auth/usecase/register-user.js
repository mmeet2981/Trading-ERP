'use strict';

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
  ValidationError,
  ConflictError
}) {
  return async function registerUser({ userData, logger }) {
    try {
      /* ---------------------------------------------------- */
      /* Validation                                           */
      /* ---------------------------------------------------- */

      const schema = Joi.object({
        first_name: Joi.string().max(50).required(),
        middle_name: Joi.string().max(50).allow('', null).optional(),
        last_name: Joi.string().max(50).required(),
        username: Joi.string().alphanum().min(3).max(50).required(),
        email: Joi.string().email().max(100).required(),
        gender: Joi.string().valid('male', 'female', 'other').required(),
        date_of_birth: Joi.date().iso().max('now').required(),
        mobile_number: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
        password: Joi.string().min(6).max(100).required(),
      });

      const { error, value } = schema.validate(userData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const err = new ValidationError('Invalid registration data');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      /* ---------------------------------------------------- */
      /* Normalization                                        */
      /* ---------------------------------------------------- */

      const normalized = {
        ...value,
        email: value.email.toLowerCase(),
        username: value.username.toLowerCase(),
      };

      /* ---------------------------------------------------- */
      /* Duplicate checks                                     */
      /* ---------------------------------------------------- */

      const existingUser = await userDb.findExistingUser({
        email: normalized.email,
        username: normalized.username,
        mobile_number: normalized.mobile_number,
        logger,
      });

      if (existingUser) {
        if (existingUser.email === normalized.email) {
          throw new ConflictError('Email already exists');
        }

        if (existingUser.username === normalized.username) {
          throw new ConflictError('Username already exists');
        }

        if (existingUser.mobile_number === normalized.mobile_number) {
          throw new ConflictError('Mobile number already exists');
        }

        throw new ConflictError('User already exists');
      }


      /* ---------------------------------------------------- */
      /* Password hashing                                     */
      /* ---------------------------------------------------- */

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(normalized.password, 10);
      } catch (err) {
        logger?.error(err);
        throw new UnknownError('Failed to process password');
      }

      /* ---------------------------------------------------- */
      /* Prepare registration payload                         */
      /* ---------------------------------------------------- */

      const registrationData = {
        username: normalized.username,
        email: normalized.email,
        password: hashedPassword,

        first_name: normalized.first_name,
        middle_name: normalized.middle_name,
        last_name: normalized.last_name,

        gender: normalized.gender,
        date_of_birth: normalized.date_of_birth,
        mobile_number: normalized.mobile_number,

        employee_code: null,
        date_of_joining: new Date(),
        employment_status: 'active',
        country: 'India',

        is_admin: false,
        is_deleted: false,

        created_by: null,
        updated_by: null,
      };

      /* ---------------------------------------------------- */
      /* Create user (DB)                                     */
      /* ---------------------------------------------------- */

      try {
        const createdUser = await userDb.createUser({
          userData: registrationData,
          logger,
        });

        return {
          success: true,
          message: 'user registered',
          data: createdUser,
        };
      } catch (err) {
        /**
         * Handle PostgreSQL unique constraint violation
         */
        if (err?.parent?.code === '23505') {
          const detail = err.parent.detail || '';

          if (detail.includes('(email)')) {
            throw new ConflictError('Email already exists');
          }
          if (detail.includes('(username)')) {
            throw new ConflictError('Username already exists');
          }
          if (detail.includes('(mobile_number)')) {
            throw new ConflictError('Mobile number already exists');
          }

          throw new ConflictError('Duplicate value violates unique constraint');
        }

        throw err;
      }

    } catch (err) {
      logger?.error(err);

      // Known application errors
      if (err.statusCode) {
        throw err;
      }

      // Fallback
      throw new UnknownError(err.message || 'User registration failed');
    }
  };
};
