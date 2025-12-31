const express = require('express');
const router = express.Router();
const { createInquiryAction, getInquiryListAction , getInquiryDetailsAction , updateInquiryAction, softDeleteInquiryAction} = require('../modules/inquiries/controller');

// Create inquiry route
router.post('/', createInquiryAction);

// Get inquiry list route
router.get('/', getInquiryListAction);

// Get inquiry details route
router.get('/:id', getInquiryDetailsAction);

// Update inquiry route
router.put('/:id', updateInquiryAction);

// Soft delete inquiry route
router.delete('/:id', softDeleteInquiryAction);

module.exports = router;
