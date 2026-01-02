'use strict';

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
  ValidationError,
  ConflictError
}) {
  return async function createUser({ userData, createdBy, logger }) {
    try {
      /* ---------------------------------------------------- */
      /* Validation (Schema)                                  */
      /* ---------------------------------------------------- */

      const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(50).required(),
        password: Joi.string().min(6).max(100).required(),
        email: Joi.string().email().max(100).required(),
        employee_code: Joi.string().max(30).allow(null, "").optional(),
        first_name: Joi.string().max(50).required(),
        middle_name: Joi.string().max(50).allow(null, "").optional(),
        last_name: Joi.string().max(50).required(),
        gender: Joi.string().valid("male", "female", "other").allow(null).optional(),
        date_of_birth: Joi.date().iso().allow(null).optional(),
        blood_group: Joi.string().max(5).allow(null).optional(),
        marital_status: Joi.string().max(20).allow(null).optional(),
        mobile_number: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
        alternate_mobile: Joi.string().pattern(/^[0-9]{10,15}$/).allow(null).optional(),
        address_line1: Joi.string().max(100).allow(null).optional(),
        address_line2: Joi.string().max(100).allow(null).optional(),
        city: Joi.string().max(50).allow(null).optional(),
        taluka: Joi.string().max(50).allow(null).optional(),
        district: Joi.string().max(50).allow(null).optional(),
        state: Joi.string().max(50).allow(null).optional(),
        country: Joi.string().max(50).default("India").optional(),
        pin_code: Joi.string().max(10).allow(null).optional(),
        department_id: Joi.number().integer().allow(null).optional(),
        designation_id: Joi.number().integer().allow(null).optional(),
        employment_type_id: Joi.number().integer().allow(null).optional(),
        date_of_joining: Joi.date().iso().required(),
        reporting_manager_id: Joi.number().integer().allow(null).optional(),
        profile_photo_url: Joi.string().uri().allow(null).optional(),
        is_admin: Joi.boolean().default(false).optional(),
      });

      const { error, value } = schema.validate(userData, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const err = new ValidationError("Invalid user input");
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.')
        }));
        throw err;
      }

      /* ---------------------------------------------------- */
      /* Duplicate Checks (Business Logic)                    */
      /* ---------------------------------------------------- */

      const existing = await userDb.findByEmailOrUsernameOrCode({
        email: value.email,
        username: value.username,
        employee_code: value.employee_code || null,
        logger,
      });

      if (existing) {
        if (existing.email === value.email) {
          throw new ConflictError("Email already exists");
        }
        if (existing.username === value.username) {
          throw new ConflictError("Username already exists");
        }
        if (
          value.employee_code &&
          existing.employee_code === value.employee_code
        ) {
          throw new ConflictError("Employee code already exists");
        }
      }

      /* ---------------------------------------------------- */
      /* Password Hashing                                     */
      /* ---------------------------------------------------- */

      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(value.password, 10);
      } catch (err) {
        logger?.error(err);
        throw new UnknownError("Failed to process password");
      }

      /* ---------------------------------------------------- */
      /* Create User (DB Layer)                               */
      /* ---------------------------------------------------- */

      try {
        const createdUser = await userDb.createUser({
          userData: {
            ...value,
            password: hashedPassword,
            created_by: createdBy,
            updated_by: createdBy,
            employment_status: value.employment_status || "active",
          },
          logger,
        });

        return {
          success: true,
          message: "user created",
          data: createdUser,
        };
      } catch (err) {
        /**
         * Handle DB unique constraint errors safely
         * (PostgreSQL: 23505)
         */
        if (err?.parent?.code === '23505') {
          const detail = err.parent.detail || '';

          if (detail.includes('(email)')) {
            throw new ConflictError("Email already exists");
          }
          if (detail.includes('(username)')) {
            throw new ConflictError("Username already exists");
          }
          if (detail.includes('(employee_code)')) {
            throw new ConflictError("Employee code already exists");
          }

          throw new ConflictError("Duplicate value violates unique constraint");
        }

        throw err;
      }

    } catch (err) {
      logger?.error(err);

      // Known application errors → bubble up
      if (err.statusCode) {
        throw err;
      }

      // Fallback safety net
      throw new UnknownError(err.message || "User creation failed");
    }
  };
};
