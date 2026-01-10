'use strict';

module.exports = function ({
  tokenService
}) {
  return async function logoutUser({ logger }) {
    // Just return success - cookie clearing happens in controller
    return {
      success: true,
      message: "Logout successful",
    };
  };
};