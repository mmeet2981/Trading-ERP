
'use strict';

module.exports = function ({
   userDb,
   Joi,
   bcrypt,
   UnknownError
  }) {
  return async function createUser({ userData, createdBy, logger }) {
    // Validation schema - adjust required/optional fields as per your business rules
    const schema = Joi.object({
      username: Joi.string().alphanum().min(3).max(50).required(),
      password: Joi.string().min(6).max(100).required(),
      email: Joi.string().email().max(100).required(),
      employee_code: Joi.string().max(30).allow(null, "").optional(),
      first_name: Joi.string().max(50).required(),
      middle_name: Joi.string().max(50).allow("").optional(),
      last_name: Joi.string().max(50).required(),
      gender: Joi.string().valid("male", "female", "other").optional(),
      date_of_birth: Joi.date().iso().optional(),
      mobile_number: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
      department_id: Joi.number().integer().optional().allow(null),
      designation_id: Joi.number().integer().optional().allow(null),
      employment_type: Joi.string()
        .valid("full_time", "part_time", "contract", "intern")
        .default("full_time"),
      date_of_joining: Joi.date().iso().required(),
      reporting_manager_id: Joi.number().integer().optional().allow(null),
      user_role: Joi.string()
        .valid("manager", "sales", "account", "worker", "admin_manager")
        .required(),
      // Add more optional fields if needed
    });

    const { error, value } = schema.validate(userData);
    if (error) {
      throw new UnknownError(error.details[0].message);
    }

    // Check uniqueness (only check employee_code if provided)
    const existing = await userDb.findByEmailOrUsernameOrCode({
      email: value.email,
      username: value.username,
      employee_code: value.employee_code || null,
      logger,
    });

    if (existing) {
      let field = '';
      if (existing.email === value.email) {
        field = "email";
      } else if (existing.username === value.username) {
        field = "username";
      } else if (value.employee_code && existing.employee_code === value.employee_code) {
        field = "employee_code";
      }
      if (field) {
        throw new UnknownError(`User with this ${field} already exists`);
      }
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    // Create user
    const createdUser = await userDb.createUser({
      userData: {
        ...value,
        password: hashedPassword,
        created_by: createdBy,
        updated_by: createdBy,
        employment_status: "active",
        country: "India",
      },
      logger,
    });

    return {
      success: true,
      message: "User created successfully",
      user: {
        user_id: createdUser.user_id,
        username: createdUser.username,
        email: createdUser.email,
        employee_code: createdUser.employee_code,
        full_name: createdUser.full_name,
        user_role: createdUser.user_role,
        department_id: createdUser.department_id,
        designation_id: createdUser.designation_id,
        employment_status: createdUser.employment_status,
        date_of_joining: createdUser.date_of_joining,
      },
    };
  };
};