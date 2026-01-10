const express = require('express');
const router = express.Router();
const {
  createInquiryInteractionAction,
  updateInquiryInteractionAction,
  deleteInquiryInteractionAction,
  getInquiryInteractionsByInquiryIdAction,
} = require('../modules/inquiry_interactions/controller');

// Create inquiry interaction route
router.post('/', createInquiryInteractionAction);

// Get inquiry interactions by inquiry ID (with pagination and filters)
router.get('/:inquiryId', getInquiryInteractionsByInquiryIdAction);

// Update inquiry interaction route
router.put('/:id', updateInquiryInteractionAction);

// Delete inquiry interaction route
router.delete('/:id', deleteInquiryInteractionAction);

module.exports = router;

