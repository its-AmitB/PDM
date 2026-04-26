const express = require('express');
const router = express.Router();
const bomController = require('../controllers/bomController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', bomController.getBOMList);
router.get('/:productId', bomController.getBOMView);

module.exports = router;
