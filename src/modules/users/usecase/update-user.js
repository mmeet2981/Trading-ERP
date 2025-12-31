
'use strict';

module.exports = function ({
   userDb,
   Joi,
   UnknownError
  }) {
  return async function updateUser({ user_id, userData, updatedBy, logger }) {
    // Validation schema - all fields optional for update
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(50).optional(),
      password: Joi.string().min(6).max(100).optional(),
      email: Joi.string().email().max(100).optional(),
      employee_code: Joi.string().max(30).allow(null, "").optional(),
      first_name: Joi.string().max(50).optional(),
      middle_name: Joi.string().max(50).allow("").optional(),
      last_name: Joi.string().max(50).optional(),
      gender: Joi.string().valid("male", "female", "other").optional(),
      date_of_birth: Joi.date().iso().optional(),
      mobile_number: Joi.string().pattern(/^[0-9]{10,15}$/).optional(),
      department_id: Joi.number().integer().optional().allow(null),
      designation_id: Joi.number().integer().optional().allow(null),
      employment_type: Joi.string()
        .valid("full_time", "part_time", "contract", "intern")
        .optional(),
      employment_status: Joi.string()
        .valid("active", "inactive", "terminated", "on_leave")
        .optional(),
      date_of_joining: Joi.date().iso().optional(),
      reporting_manager_id: Joi.number().integer().optional().allow(null),
      user_role: Joi.string()
        .valid("manager", "sales", "account", "worker", "admin_manager")
        .optional(),
      country: Joi.string().max(100).optional(),
      marital_status: Joi.string()
        .valid("single", "married", "divorced", "widowed")
        .optional(),
      is_admin: Joi.boolean().optional(),
    });

    const { error, value } = schema.validate(userData);
    if (error) {
      throw new UnknownError(error.details[0].message);
    }

    // Check if user exists
    const existingUser = await userDb.findUserById({
      user_id,
      logger,
    });

    if (!existingUser) {
      throw new UnknownError("User not found");
    }

    // Check uniqueness for email, username, employee_code if they are being updated
    if (value.email || value.username || value.employee_code !== undefined) {
      const existing = await userDb.findByEmailOrUsernameOrCode({
        email: value.email || existingUser.email,
        username: value.username || existingUser.username,
        employee_code: value.employee_code !== undefined ? (value.employee_code || null) : existingUser.employee_code,
        logger,
      });

      if (existing && existing.user_id !== user_id) {
        let field = '';
        if (value.email && existing.email === value.email) {
          field = "email";
        } else if (value.username && existing.username === value.username) {
          field = "username";
        } else if (value.employee_code && existing.employee_code === value.employee_code) {
          field = "employee_code";
        }
        if (field) {
          throw new UnknownError(`User with this ${field} already exists`);
        }
      }
    }

    // Update user
    const updatedUser = await userDb.updateUser({
      user_id,
      userData: value,
      updatedBy,
      logger,
    });

    return {
      success: true,
      message: "User updated successfully",
      user: {
        user_id: updatedUser.user_id,
        username: updatedUser.username,
        email: updatedUser.email,
        employee_code: updatedUser.employee_code,
        full_name: updatedUser.full_name,
        user_role: updatedUser.user_role,
        department_id: updatedUser.department_id,
        designation_id: updatedUser.designation_id,
        employment_status: updatedUser.employment_status,
        employment_type: updatedUser.employment_type,
        date_of_joining: updatedUser.date_of_joining,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        middle_name: updatedUser.middle_name,
        gender: updatedUser.gender,
        mobile_number: updatedUser.mobile_number,
        is_admin: updatedUser.is_admin,
        updatedAt: updatedUser.updatedAt,
      },
    };
  };
};

