const express = require('express');
const router = express.Router();
const { 
  createInquiryInteractionAction,
  updateInquiryInteractionAction,
  deleteInquiryInteractionAction,
  getInquiryInteractionsByIdAction,
} = require('../modules/inquiry_interactions/controller');

// Create inquiry interaction route
router.post('/', createInquiryInteractionAction);

// Get inquiry interaction details route
router.get('/:id', getInquiryInteractionsByIdAction);

// Update inquiry interaction route
router.put('/:id', updateInquiryInteractionAction);

// Delete inquiry interaction route
router.delete('/:id', deleteInquiryInteractionAction);

module.exports = router;

