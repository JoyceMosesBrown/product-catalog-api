const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           example: "64a7b8c9d12e3f4a5b6c7d8e"
 *         quantity:
 *           type: number
 *           example: 2
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         totalPrice:
 *           type: number
 *           example: 250.0
 *         paymentMethod:
 *           type: string
 *           example: "Cash on Delivery"
 *         createdAt:
 *           type: string
 *           format: date-time
 *     PlaceOrderInput:
 *       type: object
 *       properties:
 *         paymentMethod:
 *           type: string
 *           example: "Cash on Delivery"
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
 * /api/orders:
 *   post:
 *     summary: Place an order from the user's cart
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaceOrderInput'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order placed successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cart is empty or contains invalid items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error while placing order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    const items = cart.items
      .filter(item => item.product)
      .map(item => ({
        product: item.product._id,
        quantity: item.quantity,
      }));

    if (items.length === 0) {
      return res.status(400).json({ message: 'No valid products in cart' });
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      totalPrice,
      paymentMethod: req.body.paymentMethod || 'Cash on Delivery',
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Order failed', error: err.message });
  }
};

/**
 * @swagger
 * /api/orders/my:
 *   get:
 *     summary: Get all orders of the current user
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Failed to fetch user's orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All orders fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Failed to fetch all orders
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders', error: err.message });
  }
};
