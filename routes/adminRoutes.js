const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, updateOrderStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

// User management
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

// Order management
router.put('/orders/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
