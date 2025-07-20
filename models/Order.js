const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Card', 'Mobile Money'],
    default: 'Cash on Delivery',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending',
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
