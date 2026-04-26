const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const { protect } = require('../middleware/authMiddleware');

router.get('/bom/:id', protect, pdfController.generateBOMPDF);

module.exports = router;
