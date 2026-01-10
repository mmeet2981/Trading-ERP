'use strict';

module.exports = function ({
  userDb,
  Joi,
  ValidationError,
  UnknownError,
}) {
  return async function getUsers({
    page,
    limit,
    search,
    role_id,
    department_id,
    logger,
  }) {
    try {
      /* ---------------------------------------------------- */
      /* Validation                                           */
      /* ---------------------------------------------------- */

      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        search: Joi.string().allow(null, '').optional(),
        role_id: Joi.number().integer().allow(null).optional(),
        department_id: Joi.number().integer().allow(null).optional(),
      });

      const { error, value } = schema.validate(
        { page, limit, search, role_id, department_id },
        { abortEarly: false }
      );

      if (error) {
        const err = new ValidationError('Invalid query parameters');
        err.details = error.details.map(d => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      /* ---------------------------------------------------- */
      /* Fetch Users                                          */
      /* ---------------------------------------------------- */

      const { rows, totalCount } = await userDb.getUsers({
        page: value.page,
        limit: value.limit,
        search: value.search,
        role_id: value.role_id,
        department_id: value.department_id,
        logger,
      });

      return {
        success: true,
        message: 'users fetched successfully',
        data: rows,
        meta: {
          page: value.page,
          limit: value.limit,
          total: totalCount,
        },
      };
    } catch (err) {
      logger?.error(err);

      if (err.statusCode) {
        throw err;
      }

      throw new UnknownError(err.message || 'Failed to fetch users');
    }
  };
};
