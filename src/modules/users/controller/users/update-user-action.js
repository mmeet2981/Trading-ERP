'use strict';

module.exports = function ({
  createErrorResponse,
  createSuccessResponse,
  updateUserUseCase,
  uploadProfilePicture,
}) {
  return async function updateUserAction(req, res) {
    const logger = req.log;

    try {
      const { user_id } = req.params;
      const userData = req.body;
      const updatedBy = req.user?.user_id || null;

      if (req.file) {
        const profileUrl = await uploadProfilePicture({
          file: req.file,
          firstName: userData.first_name,
          lastName: userData.last_name,
        });

        userData.profile_photo_url = profileUrl;
      }

      const result = await updateUserUseCase({
        user_id,
        userData,
        updatedBy,
        logger,
      });

      return createSuccessResponse(200, result, res);
    } catch (error) {
      logger.error(error);
      logger.error('Error in updateUserAction');
      return createErrorResponse(error, res);
    }
  };
};
