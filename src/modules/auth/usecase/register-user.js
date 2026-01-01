'use strict';

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
}) {
  return async function registerUser({ userData, logger }) {

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

    const { error, value } = schema.validate(userData);
    if (error) {
      throw new UnknownError(error.details[0].message);
    }

    const normalized = {
      ...value,
      email: value.email.toLowerCase(),
      username: value.username.toLowerCase(),
    };

    const existingUser = await userDb.findExistingUser({
      email: normalized.email,
      username: normalized.username,
      mobile_number: normalized.mobile_number,
      logger,
    });

    if (existingUser) {
      throw new UnknownError('User already exists with given credentials');
    }

    const hashedPassword = await bcrypt.hash(normalized.password, 10);
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

    const createdUser = await userDb.createUser({
      userData: registrationData,
      logger,
    });

    return {
      success: true,
      message: 'user registered',
      data: createdUser,
    };
  };
};
