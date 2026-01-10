const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createInquiry, getInquiryList, getInquiryDetails, updateInquiry, softDeleteInquiry } = require('../../usecase/inquiries');

const makeCreateInquiryAction = require('./create-inquiry-action');
const makeGetInquiryListAction = require('./get-inquiry-list-action');
const makeGetInquiryDetailsAction = require('./get-inquiry-details-action');
const makeUpdateInquiryAction = require('./update-inquiry-action');
const makeSoftDeleteInquiryAction = require('./soft-delete-inquiry-action');

const createInquiryAction = makeCreateInquiryAction({
  createErrorResponse,
  createSuccessResponse,
  createInquiry
});

const getInquiryListAction = makeGetInquiryListAction({
  createErrorResponse,
  createSuccessResponse,
  getInquiryList
});

const getInquiryDetailsAction = makeGetInquiryDetailsAction({
  createErrorResponse,
  createSuccessResponse,
  getInquiryDetails
});

const updateInquiryAction = makeUpdateInquiryAction({
  createErrorResponse,
  createSuccessResponse,
  updateInquiry
});

const softDeleteInquiryAction = makeSoftDeleteInquiryAction({
  createErrorResponse,
  createSuccessResponse,
  softDeleteInquiry
});

module.exports = {
  createInquiryAction,
  getInquiryListAction,
  getInquiryDetailsAction,
  updateInquiryAction,
  softDeleteInquiryAction,
};
