'use strict';

module.exports = function ({
  userDb,
  Joi,
  ValidationError,
  UnknownError,
  NotFoundError,
}) {
  return async function getUserById({ user_id, logger }) {
    try {
      /* ---------------------------------------------------- */
      /* Validation                                           */
      /* ---------------------------------------------------- */

      const schema = Joi.object({
        user_id: Joi.number().integer().required(),
      });

      const { error, value } = schema.validate(
        { user_id },
        { abortEarly: false }
      );

      if (error) {
        const err = new ValidationError('Invalid user id');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      /* ---------------------------------------------------- */
      /* Fetch User                                           */
      /* ---------------------------------------------------- */

      const user = await userDb.findUserById({
        user_id: value.user_id,
        logger,
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      /* ---------------------------------------------------- */
      /* Remove Sensitive Fields                              */
      /* ---------------------------------------------------- */

      delete user.password;

      return {
        success: true,
        message: 'user fetched successfully',
        data: user,
      };
    } catch (err) {
      logger?.error(err);

      if (err.statusCode) {
        throw err;
      }

      throw new UnknownError(err.message || 'Failed to fetch user');
    }
  };
};
