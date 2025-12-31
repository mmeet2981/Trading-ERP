'use strict';

module.exports = function ({
   userDb,
   Joi,
   bcrypt,
   UnknownError
  }) {
  return async function registerUser({ userData, logger }) {
    const schema = Joi.object({
      first_name: Joi.string().max(50).required().label('First Name'),
      middle_name: Joi.string().max(50).allow("", null).optional().label('Middle Name'),
      last_name: Joi.string().max(50).required().label('Last Name'),
      username: Joi.string().alphanum().min(3).max(50).required().label('Username'),
      email: Joi.string().email().max(100).required().label('Email'),
      gender: Joi.string().valid("male", "female", "other").required().label('Gender'),
      date_of_birth: Joi.date().iso().max('now').required().label('Date of Birth'),
      mobile_number: Joi.string().pattern(/^[0-9]{10,15}$/).required().label('Mobile Number'),
      password: Joi.string().min(6).max(100).required().label('Password'),
    });

    const { error, value } = schema.validate(userData);
    if (error) {
      throw new UnknownError(error.details[0].message);
    }

    // Check uniqueness of username, email, and mobile
    const existingUser = await userDb.findExistingUser({
      email: value.email,
      username: value.username,
      mobile_number: value.mobile_number,
      logger,
    });

    if (existingUser) {
      let field = '';
      if (existingUser.email === value.email) field = 'email';
      else if (existingUser.username === value.username) field = 'username';
      else if (existingUser.mobile_number === value.mobile_number) field = 'mobile number';
      
      throw new UnknownError(`User with this ${field} already exists`);
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(value.password, saltRounds);

    const registrationData = {
      ...value,
      username: value.username.toLowerCase(),
      email: value.email.toLowerCase(),
      password: hashedPassword,
      employee_code: null, // employee_code is optional, set to null for registration
      user_role: 'worker',
      date_of_joining: new Date().toISOString().split('T')[0],
      employment_status: 'active',
      marital_status: 'single',
      employment_type: 'full_time',
      country: 'India',
      // created_by and updated_by will be null for self-registration
      created_by: null,
      updated_by: null,
      is_admin: false,
      is_deleted: false,
    };

    // Create user
    const createdUser = await userDb.createUser({
      userData: registrationData,
      logger,
    });

    delete createdUser.password;

    return {
      success: true,
      message: "User registered successfully",
      user: {
        user_id: createdUser.user_id,
        username: createdUser.username,
        email: createdUser.email,
        full_name: createdUser.full_name,
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        gender: createdUser.gender,
        mobile_number: createdUser.mobile_number,
        employment_status: createdUser.employment_status,
        date_of_joining: createdUser.date_of_joining,
        created_at: createdUser.createdAt,
      },
    };
  };
};