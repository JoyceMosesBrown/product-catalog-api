const mongoose = require('mongoose');

// Define the Product schema with an embedded category (only name)
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: { 
        type: String,
        required: true,
 
  },
  description: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    enum: ['Red', 'Blue', 'Green', 'Black', 'White', 'Yellow'],
    required: true,
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L', 'XL', 'XXL'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);