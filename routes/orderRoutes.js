const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, getAllOrders);

module.exports = router;
