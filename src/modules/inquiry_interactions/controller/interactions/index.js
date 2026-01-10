const { createSuccessResponse, createErrorResponse } = require('../../../../utils/response');
const { createInquiryInteraction, updateInquiryInteraction, deleteInquiryInteraction, getInquiryInteractionsByInquiryId } = require('../../usecase/interactions');

const makeCreateInquiryInteractionAction = require('./create-inquiry-interaction-action');
const makeUpdateInquiryInteractionAction = require('./update-inquiry-interaction-action');
const makeDeleteInquiryInteractionAction = require('./delete-inquiry-interaction-action');
const makeGetInquiryInteractionsByInquiryIdAction = require('./get-inquiry-interactions-by-inquiry-id-action');

const createInquiryInteractionAction = makeCreateInquiryInteractionAction({
  createErrorResponse,
  createSuccessResponse,
  createInquiryInteraction
});

const updateInquiryInteractionAction = makeUpdateInquiryInteractionAction({
  createErrorResponse,
  createSuccessResponse,
  updateInquiryInteraction
});

const deleteInquiryInteractionAction = makeDeleteInquiryInteractionAction({
  createErrorResponse,
  createSuccessResponse,
  deleteInquiryInteraction
});

const getInquiryInteractionsByInquiryIdAction = makeGetInquiryInteractionsByInquiryIdAction({
  createErrorResponse,
  createSuccessResponse,
  getInquiryInteractionsByInquiryId
});

module.exports = {
  createInquiryInteractionAction,
  updateInquiryInteractionAction,
  deleteInquiryInteractionAction,
  getInquiryInteractionsByInquiryIdAction,
};
