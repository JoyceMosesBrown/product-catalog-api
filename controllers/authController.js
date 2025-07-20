const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "60c72b2f5f1b2c001c8d4567"
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         role:
 *           type: string
 *           example: "client"
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           example: "Password123!"
 *         role:
 *           type: string
 *           enum: [client, admin]
 *           example: "client"
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: "johndoe@example.com"
 *         password:
 *           type: string
 *           example: "Password123!"
 *     AuthResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/AuthUser'
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, role });
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
