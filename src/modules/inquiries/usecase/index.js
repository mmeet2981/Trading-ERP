// Import usecases from inquiries sub-folder
const {
  createInquiry,
  getInquiryList,
  getInquiryDetails,
  updateInquiry,
  softDeleteInquiry,
} = require("./inquiries");

module.exports = {
  createInquiry,
  getInquiryList,
  getInquiryDetails,
  updateInquiry,
  softDeleteInquiry,
};