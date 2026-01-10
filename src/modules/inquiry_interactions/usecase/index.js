// Import usecases from interactions sub-folder
const {
  createInquiryInteraction,
  updateInquiryInteraction,
  deleteInquiryInteraction,
  getInquiryInteractionsByInquiryId,
} = require("./interactions");

module.exports = {
  createInquiryInteraction,
  updateInquiryInteraction,
  deleteInquiryInteraction,
  getInquiryInteractionsByInquiryId,
};

