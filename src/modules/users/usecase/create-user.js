'use strict';

module.exports = function ({
   userDb,
   Joi,
   bcrypt,
   UnknownError
  }) {
  return async function createUser({ userData, createdBy, logger }) {
    // Validation schema - focused on users table fields only
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

    const { error, value } = schema.validate(userData);
    if (error) {
      throw new UnknownError(error.details[0].message);
    }

   
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

    // Create user (core users table insert)
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
      data: createdUser
    };    
  };
};