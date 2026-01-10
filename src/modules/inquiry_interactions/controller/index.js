// Import actions from interactions sub-folder
const {
  createInquiryInteractionAction,
  updateInquiryInteractionAction,
  deleteInquiryInteractionAction,
  getInquiryInteractionsByInquiryIdAction,
} = require("./interactions");

module.exports = {
  createInquiryInteractionAction,
  updateInquiryInteractionAction,
  deleteInquiryInteractionAction,
  getInquiryInteractionsByInquiryIdAction,
};

