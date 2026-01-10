const { UnknownError, ValidationError, NotFoundError } = require('../../../../utils/errors');
const { inquiryInteractionDb } = require('../../data-access');
const Joi = require('joi');

const makeCreateInquiryInteraction = require('./create-inquiry-interaction');
const makeUpdateInquiryInteraction = require('./update-inquiry-interaction');
const makeDeleteInquiryInteraction = require('./delete-inquiry-interaction');
const makeGetInquiryInteractionsByInquiryId = require('./get-inquiry-interactions-by-inquiry-id');

const createInquiryInteraction = makeCreateInquiryInteraction({
  inquiryInteractionDb,
  UnknownError,
  ValidationError,
  NotFoundError,
  Joi
});

const updateInquiryInteraction = makeUpdateInquiryInteraction({
  inquiryInteractionDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
});

const deleteInquiryInteraction = makeDeleteInquiryInteraction({
  inquiryInteractionDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
});

const getInquiryInteractionsByInquiryId = makeGetInquiryInteractionsByInquiryId({
  inquiryInteractionDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
});

module.exports = {
  createInquiryInteraction,
  updateInquiryInteraction,
  deleteInquiryInteraction,
  getInquiryInteractionsByInquiryId,
};
