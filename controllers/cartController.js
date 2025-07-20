const mongoose = require('mongoose');
const Cart = require('../models/Cart');

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: Product ID (MongoDB ObjectId)
 *           example: "64a7b8c9d12e3f4a5b6c7d8e"
 *         quantity:
 *           type: number
 *           example: 2
 *     Cart:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *     AddToCartInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: string
 *           example: "64a7b8c9d12e3f4a5b6c7d8e"
 *         quantity:
 *           type: number
 *           example: 1
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         error:
 *           type: string
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the current user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Server error while fetching cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart', error: err.message });
  }
};

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add an item to the user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartInput'
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item added to cart"
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while adding to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity <= 0) {
    return res.status(400).json({
      message: 'Invalid input. Please provide productId and a quantity greater than 0.',
    });
  }

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const index = cart.items.findIndex(item => item.product.toString() === productId);

    if (index >= 0) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart', error: err.message });
  }
};

/**
 * @swagger
 * /api/cart/remove/{productId}:
 *   delete:
 *     summary: Remove an item from the user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from the cart
 *     responses:
 *       200:
 *         description: Item removed from cart or cart deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while removing item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.removeFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).json({ message: 'Invalid product ID.' });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    if (cart.items.length === 0) {
      await Cart.findOneAndDelete({ user: req.user._id });
      return res.status(200).json({ message: 'Cart deleted successfully' });
    } else {
      await cart.save();
    }

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};
