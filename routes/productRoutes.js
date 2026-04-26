const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', productController.getProducts);
router.post('/', authorize('manager', 'admin'), productController.postProduct);
router.get('/new', authorize('manager', 'admin'), productController.getNewProduct);
router.get('/:id', productController.getProduct);
router.get('/:id/edit', authorize('manager', 'admin'), productController.getEditProduct);
router.put('/:id', authorize('manager', 'admin'), productController.putProduct);
router.delete('/:id', authorize('admin'), productController.deleteProduct);

router.post('/:id/components', authorize('manager', 'admin'), productController.postComponent);
router.delete('/:id/components/:componentId', authorize('manager', 'admin'), productController.deleteComponent);

module.exports = router;
