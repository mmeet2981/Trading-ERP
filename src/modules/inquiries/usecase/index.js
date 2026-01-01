const { UnknownError, ValidationError, NotFoundError } = require('../../../utils/errors');
const { inquiryDb } = require('../data-access');
const Joi = require('joi');

const makeCreateInquiry = require('./create-inquiry');
const makeGetInquiryList = require('./get-inquiry-list');
const makeGetInquiryDetails = require('./get-inquiry-details');
const makeUpdateInquiry = require('./update-inquiry');
const makeSoftDeleteInquiry = require('./soft-delete-inquiry');


const createInquiry = makeCreateInquiry({
  inquiryDb,
  UnknownError,
  ValidationError,
  Joi
});

const getInquiryList = makeGetInquiryList({
  inquiryDb,
  UnknownError,
  ValidationError,
  Joi
});

const getInquiryDetails = makeGetInquiryDetails({
  inquiryDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
});

const updateInquiry = makeUpdateInquiry({
  inquiryDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
});

const softDeleteInquiry = makeSoftDeleteInquiry({
  inquiryDb,
  UnknownError,
  NotFoundError,
  ValidationError,
  Joi
});

module.exports = {
  createInquiry,
  getInquiryList,
  getInquiryDetails,
  updateInquiry,
  softDeleteInquiry,
};