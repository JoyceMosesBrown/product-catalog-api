const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController'); // ✅ Make sure path and names are correct

const { protect, adminOnly } = require('../middlewares/authMiddleware'); // ✅ Ensure these exist and are functions

// ✅ Public routes
router.get('/', protect, getAllProducts);
router.get('/:id', protect, getProductById);

// ✅ Admin routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
