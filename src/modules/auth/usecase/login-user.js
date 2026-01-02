'use strict';

const { ConflictError } = require("../../../utils/errors");

module.exports = function ({
  userDb,
  Joi,
  bcrypt,
  tokenService,
  ValidationError,
  ConflictError,
  AuthenticationError
}) {
  return async function loginUser({ credentials, logger }) {
    // Validation schema for login
    const schema = Joi.object({
      username_or_email: Joi.string().required().label('Username or Email'),
      password: Joi.string().required().label('Password'),
    });

    const { error, value } = schema.validate(credentials);
    if (error) {
      throw new ValidationError(error.details[0].message);
    }


    // Find user by username or email
    const user = await userDb.findByUsernameOrEmail({
      username_or_email: value.username_or_email,
      logger,
    });

    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }


    // Check if user is deleted
    if (user.is_deleted) {
      throw new ConflictError("Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(value.password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationError("Invalid credentials");

    }

    // Update last login timestamp
    await userDb.updateLastLogin({
      user_id: user.user_id,
      logger,
    });

    // Generate JWT token using tokenService
    const tokenPayload = {
      user_id: user.user_id,
      username: user.username,
      is_admin: user.is_admin,
    };


    const token = tokenService.generateToken(tokenPayload);

    // Remove sensitive data
    delete user.password;

    return {
      success: true,
      message: "Login successful",
      token: token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        first_name: user.first_name,
        last_name: user.last_name,
        user_role: user.user_role,
        is_admin: user.is_admin,
        profile_photo_url: user.profile_photo_url,
      },
    };
  };
};