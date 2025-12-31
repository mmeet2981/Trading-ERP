const { createSuccessResponse, createErrorResponse } = require('../../../utils/response');
const { 
  createInquiryInteraction,
  updateInquiryInteraction,
  deleteInquiryInteraction,
  getInquiryInteractionsById,
} = require('../usecase');

const makeCreateInquiryInteractionAction = require('./create-inquiry-interaction-action');
const makeUpdateInquiryInteractionAction = require('./update-inquiry-interaction-action');
const makeDeleteInquiryInteractionAction = require('./delete-inquiry-interaction-action');
const makeGetInquiryInteractionsByIdAction = require('./get-inquiry-interactions-by-id-action'); 

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

const getInquiryInteractionsByIdAction = makeGetInquiryInteractionsByIdAction({ // Add this
  createErrorResponse,
  createSuccessResponse,
  getInquiryInteractionsById
});

module.exports = {
  createInquiryInteractionAction,
  updateInquiryInteractionAction,
  deleteInquiryInteractionAction,
  getInquiryInteractionsByIdAction,
};

