// Import actions from inquiries sub-folder
const {
  createInquiryAction,
  getInquiryListAction,
  getInquiryDetailsAction,
  updateInquiryAction,
  softDeleteInquiryAction,
} = require("./inquiries");

module.exports = {
  createInquiryAction,
  getInquiryListAction,
  getInquiryDetailsAction,
  updateInquiryAction,
  softDeleteInquiryAction,
};