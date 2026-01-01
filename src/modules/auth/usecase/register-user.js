'use strict';

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  UnknownError,
}) {
  return async function registerUser({ userData, logger }) {

    /* ------------------------------ */
    /* Validation                     */
    /* ------------------------------ */

    const schema = Joi.object({
      first_name: Joi.string().max(50).required().label('First Name'),
      middle_name: Joi.string().max(50).allow('', null).optional().label('Middle Name'),
      last_name: Joi.string().max(50).required().label('Last Name'),
      username: Joi.string().alphanum().min(3).max(50).required().label('Username'),
      email: Joi.string().email().max(100).required().label('Email'),
      gender: Joi.string().valid('male', 'female', 'other').required().label('Gender'),
      date_of_birth: Joi.date().iso().max('now').required().label('Date of Birth'),
      mobile_number: Joi.string().pattern(/^[0-9]{10,15}$/).required().label('Mobile Number'),
      password: Joi.string().min(6).max(100).required().label('Password'),
    });

    const { error, value } = schema.validate(userData);
    if (error) {
      throw new UnknownError(error.details[0].message);
    }

    /* ------------------------------ */
    /* Uniqueness Check               */
    /* ------------------------------ */

    const existingUser = await userDb.findExistingUser({
      email: value.email.toLowerCase(),
      username: value.username.toLowerCase(),
      mobile_number: value.mobile_number,
      logger,
    });

    if (existingUser) {
      if (existingUser.email === value.email.toLowerCase()) {
        throw new UnknownError('Email already exists');
      }
      if (existingUser.username === value.username.toLowerCase()) {
        throw new UnknownError('Username already exists');
      }
      if (existingUser.mobile_number === value.mobile_number) {
        throw new UnknownError('Mobile number already exists');
      }
    }

    /* ------------------------------ */
    /* Password Hashing               */
    /* ------------------------------ */

    const hashedPassword = await bcrypt.hash(value.password, 10);

    /* ------------------------------ */
    /* Prepare Registration Payload   */
    /* ------------------------------ */

    const registrationData = {
      username: value.username.toLowerCase(),
      email: value.email.toLowerCase(),
      password: hashedPassword,

      first_name: value.first_name,
      middle_name: value.middle_name,
      last_name: value.last_name,

      gender: value.gender,
      date_of_birth: value.date_of_birth,
      mobile_number: value.mobile_number,

      employee_code: null,              // optional
      date_of_joining: new Date(),       // today
      employment_status: 'active',       // default
      country: 'India',

      is_admin: false,
      is_deleted: false,

      created_by: null,
      updated_by: null,
    };

    /* ------------------------------ */
    /* Create User                    */
    /* ------------------------------ */

    const createdUser = await userDb.createUser({
      userData: registrationData,
      logger,
    });

    /* ------------------------------ */
    /* Response                       */
    /* ------------------------------ */

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        user_id: createdUser.user_id,
        username: createdUser.username,
        email: createdUser.email,
        full_name: createdUser.full_name,
        first_name: createdUser.first_name,
        last_name: createdUser.last_name,
        mobile_number: createdUser.mobile_number,
        created_at: createdUser.createdAt,
      },
    };
  };
};
