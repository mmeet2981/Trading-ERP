'use strict';

module.exports = function ({
  userDb,
  Joi,
  UnknownError,
  ValidationError,
  ConflictError,
}) {
  return async function updateUser({
    user_id,
    userData,
    updatedBy,
    logger,
  }) {
    try {
      /* ---------------------------------------------------- */
      /* Validate Params                                      */
      /* ---------------------------------------------------- */

      if (!user_id) {
        throw new ValidationError('User ID is required');
      }

      /* ---------------------------------------------------- */
      /* Check User Exists                                    */
      /* ---------------------------------------------------- */

      const existingUser = await userDb.findUserById({
        user_id,
        logger,
      });

      if (!existingUser) {
        const err = new ValidationError('User not found');
        err.statusCode = 404;
        throw err;
      }

      /* ---------------------------------------------------- */
      /* Validation Schema (PATCH semantics)                   */
      /* ---------------------------------------------------- */

      const schema = Joi.object({
        username: Joi.string().alphanum().min(3).max(50).optional(),
        email: Joi.string().email().max(100).optional(),
        employee_code: Joi.string().max(30).allow(null, '').optional(),
        first_name: Joi.string().max(50).optional(),
        middle_name: Joi.string().max(50).allow(null, '').optional(),
        last_name: Joi.string().max(50).optional(),
        gender: Joi.string().valid('male', 'female', 'other').allow(null).optional(),
        date_of_birth: Joi.date().iso().allow(null).optional(),
        blood_group: Joi.string().max(5).allow(null).optional(),
        marital_status: Joi.string().max(20).allow(null).optional(),
        mobile_number: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
        alternate_mobile: Joi.string().pattern(/^[0-9]{10,15}$/).allow(null).optional(),
        address_line1: Joi.string().max(100).allow(null).optional(),
        address_line2: Joi.string().max(100).allow(null).optional(),
        city: Joi.string().max(50).allow(null).optional(),
        taluka: Joi.string().max(50).allow(null).optional(),
        district: Joi.string().max(50).allow(null).optional(),
        state: Joi.string().max(50).allow(null).optional(),
        country: Joi.string().max(50).optional(),
        pin_code: Joi.string().max(10).allow(null).optional(),
        department_id: Joi.number().integer().allow(null).optional(),
        designation_id: Joi.number().integer().allow(null).optional(),
        employment_type_id: Joi.number().integer().allow(null).optional(),
        employment_status: Joi.string().max(20).optional(),
        date_of_joining: Joi.date().iso().optional(),
        reporting_manager_id: Joi.number().integer().allow(null).optional(),
        profile_photo_url: Joi.string().max(500).allow(null).optional(),
        is_admin: Joi.boolean().optional(),
      }).min(1); // at least one field must be updated

      const { error, value } = schema.validate(userData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const err = new ValidationError('Invalid update input');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      /* ---------------------------------------------------- */
      /* Uniqueness Checks (Only if updating)                  */
      /* ---------------------------------------------------- */

      if (value.email || value.username || value.employee_code) {
        const duplicate = await userDb.findByEmailOrUsernameOrCode({
          email: value.email,
          username: value.username,
          employee_code: value.employee_code,
          logger,
        });

        if (duplicate && duplicate.user_id !== Number(user_id)) {
          if (duplicate.email === value.email) {
            throw new ConflictError('Email already exists');
          }
          if (duplicate.username === value.username) {
            throw new ConflictError('Username already exists');
          }
          if (
            value.employee_code &&
            duplicate.employee_code === value.employee_code
          ) {
            throw new ConflictError('Employee code already exists');
          }
        }
      }

      /* ---------------------------------------------------- */
      /* Update User (DB Layer)                                */
      /* ---------------------------------------------------- */

      try {
        const updatedUser = await userDb.updateUser({
          user_id,
          userData: {
            ...value,
            updated_by: updatedBy,
          },
          updatedBy,
          logger,
        });

        return {
          success: true,
          message: 'user updated',
          data: updatedUser,
        };
      } catch (err) {
        if (err?.parent?.code === '23505') {
          const detail = err.parent.detail || '';

          if (detail.includes('(email)')) {
            throw new ConflictError('Email already exists');
          }
          if (detail.includes('(username)')) {
            throw new ConflictError('Username already exists');
          }
          if (detail.includes('(employee_code)')) {
            throw new ConflictError('Employee code already exists');
          }

          throw new ConflictError('Duplicate value violates unique constraint');
        }

        throw err;
      }

    } catch (err) {
      logger?.error(err);

      if (err.statusCode) {
        throw err;
      }

      throw new UnknownError(err.message || 'User update failed');
    }
  };
};
