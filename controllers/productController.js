const Product = require('../models/Product');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - color
 *         - size
 *         - price
 *         - stock
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           example: "64a7b8c9d12e3f4a5b6c7d8e"
 *         name:
 *           type: string
 *           description: Product name
 *           example: "Nike Air Max 270"
 *         category:
 *           type: string
 *           description: Product category
 *           example: "Sneakers"
 *         description:
 *           type: string
 *           description: Product description
 *           example: "Comfortable running shoes with air cushioning"
 *         color:
 *           type: string
 *           description: Product color
 *           example: "Black"
 *         size:
 *           type: string
 *           description: Product size
 *           example: "42"
 *         price:
 *           type: number
 *           description: Product price
 *           example: 129.99
 *         discount:
 *           type: number
 *           description: Discount percentage (optional)
 *           example: 10
 *         stock:
 *           type: number
 *           description: Available stock quantity
 *           example: 50
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     
 *     ProductInput:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - color
 *         - size
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           example: "Nike Air Max 270"
 *         category:
 *           type: string
 *           example: "Sneakers"
 *         description:
 *           type: string
 *           example: "Comfortable running shoes with air cushioning"
 *         color:
 *           type: string
 *           example: "Black"
 *         size:
 *           type: string
 *           example: "42"
 *         price:
 *           type: number
 *           example: 129.99
 *         discount:
 *           type: number
 *           example: 10
 *         stock:
 *           type: number
 *           example: 50
 *     
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         message:
 *           type: string
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/Product'
 *             - type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *         results:
 *           type: number
 *           description: Number of results (for list endpoints)
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [fail, error]
 *         message:
 *           type: string
 *         error:
 *           type: string
 *           description: Detailed error message
 *   
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         Enter your JWT token in the format: `your-jwt-token-here`
 *         
 *         **How to get your token:**
 *         1. Login through the `/api/auth/login` endpoint
 *         2. Copy the JWT token from the response
 *         3. Click the "Authorize" button above
 *         4. Paste your token in the "Value" field
 *         5. Click "Authorize" to apply to all secured endpoints
 * 
 * security:
 *   - BearerAuth: []
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     description: |
 *       Creates a new product in the database. 
 *       
 *       **Authentication Required:** This endpoint requires a valid JWT token.
 *       Click the "Authorize" button above and enter your token.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductInput'
 *           example:
 *             name: "Nike Air Max 270"
 *             category: "Sneakers"
 *             description: "Comfortable running shoes with air cushioning"
 *             color: "Black"
 *             size: "42"
 *             price: 129.99
 *             discount: 10
 *             stock: 50
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *             example:
 *               status: "success"
 *               message: "Product created successfully"
 *               data:
 *                 _id: "64a7b8c9d12e3f4a5b6c7d8e"
 *                 name: "Nike Air Max 270"
 *                 category: "Sneakers"
 *                 description: "Comfortable running shoes with air cushioning"
 *                 color: "Black"
 *                 size: "42"
 *                 price: 129.99
 *                 discount: 10
 *                 stock: 50
 *                 createdAt: "2024-07-20T10:30:00.000Z"
 *                 updatedAt: "2024-07-20T10:30:00.000Z"
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Required fields are missing"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Access denied. No token provided."
 *       403:
 *         description: Forbidden - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Invalid token."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Product creation failed"
 *               error: "Database connection error"
 */
exports.createProduct = async (req, res) => {
  try {
    const { name, category, description, color, size, price, discount, stock } = req.body;

    // Validate that required fields are present
    if (!name || !category || !color || !size || !price || !stock) {
      return res.status(400).json({
        status: 'fail',
        message: 'Required fields are missing',
      });
    }

    // Create a new product
    const product = new Product({
      name,
      category,
      description,
      color,
      size,
      price,
      discount,
      stock,
    });

    await product.save();

    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: 'Product creation failed',
      error: err.message,
    });
  }
};

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: |
 *       Retrieves a list of all products, sorted by creation date (newest first). 
 *       
 *       **Authentication Required:** This endpoint requires a valid JWT token.
 *       Click the "Authorize" button above and enter your token.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 results:
 *                   type: number
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *             example:
 *               status: "success"
 *               results: 2
 *               data:
 *                 - _id: "64a7b8c9d12e3f4a5b6c7d8e"
 *                   name: "Nike Air Max 270"
 *                   category: "Sneakers"
 *                   description: "Comfortable running shoes"
 *                   color: "Black"
 *                   size: "42"
 *                   price: 129.99
 *                   discount: 10
 *                   stock: 50
 *                   createdAt: "2024-07-20T10:30:00.000Z"
 *                 - _id: "64a7b8c9d12e3f4a5b6c7d8f"
 *                   name: "Adidas Ultraboost"
 *                   category: "Running"
 *                   color: "White"
 *                   size: "41"
 *                   price: 180.00
 *                   stock: 30
 *                   createdAt: "2024-07-20T09:15:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Access denied. No token provided."
 *       403:
 *         description: Forbidden - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Invalid token."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "error"
 *               message: "Failed to fetch products"
 *               error: "Database connection timeout"
 */
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch products',
      error: err.message,
    });
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: |
 *       Retrieves a single product by its MongoDB ObjectId. 
 *       
 *       **Authentication Required:** This endpoint requires a valid JWT token.
 *       Click the "Authorize" button above and enter your token.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the product
 *         schema:
 *           type: string
 *           example: "64a7b8c9d12e3f4a5b6c7d8e"
 *     responses:
 *       200:
 *         description: Product found and retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *             example:
 *               status: "success"
 *               data:
 *                 _id: "64a7b8c9d12e3f4a5b6c7d8e"
 *                 name: "Nike Air Max 270"
 *                 category: "Sneakers"
 *                 description: "Comfortable running shoes with air cushioning"
 *                 color: "Black"
 *                 size: "42"
 *                 price: 129.99
 *                 discount: 10
 *                 stock: 50
 *                 createdAt: "2024-07-20T10:30:00.000Z"
 *                 updatedAt: "2024-07-20T10:30:00.000Z"
 *       400:
 *         description: Bad request - Invalid product ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Invalid product ID"
 *               error: "Cast to ObjectId failed"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Access denied. No token provided."
 *       403:
 *         description: Forbidden - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Invalid token."
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Product not found"
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: product,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid product ID',
      error: err.message,
    });
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     description: |
 *       Updates an existing product by its MongoDB ObjectId. 
 *       
 *       **Authentication Required:** This endpoint requires a valid JWT token.
 *       Click the "Authorize" button above and enter your token.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the product to update
 *         schema:
 *           type: string
 *           example: "64a7b8c9d12e3f4a5b6c7d8e"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nike Air Max 270 Updated"
 *               category:
 *                 type: string
 *                 example: "Athletic Shoes"
 *               description:
 *                 type: string
 *                 example: "Updated comfortable running shoes"
 *               color:
 *                 type: string
 *                 example: "Navy Blue"
 *               size:
 *                 type: string
 *                 example: "43"
 *               price:
 *                 type: number
 *                 example: 139.99
 *               discount:
 *                 type: number
 *                 example: 15
 *               stock:
 *                 type: number
 *                 example: 45
 *           example:
 *             name: "Nike Air Max 270 Updated"
 *             price: 139.99
 *             discount: 15
 *             stock: 45
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *             example:
 *               status: "success"
 *               message: "Product updated successfully"
 *               data:
 *                 _id: "64a7b8c9d12e3f4a5b6c7d8e"
 *                 name: "Nike Air Max 270 Updated"
 *                 category: "Sneakers"
 *                 price: 139.99
 *                 discount: 15
 *                 stock: 45
 *                 updatedAt: "2024-07-20T11:45:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Access denied. No token provided."
 *       403:
 *         description: Forbidden - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Invalid token."
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "error"
 *               message: "Failed to update product"
 *               error: "Database write error"
 */
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update product',
      error: err.message,
    });
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: |
 *       Deletes a product from the database by its MongoDB ObjectId. 
 *       
 *       **Authentication Required:** This endpoint requires a valid JWT token.
 *       Click the "Authorize" button above and enter your token.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: MongoDB ObjectId of the product to delete
 *         schema:
 *           type: string
 *           example: "64a7b8c9d12e3f4a5b6c7d8e"
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *             example:
 *               status: "success"
 *               message: "Product deleted successfully"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Access denied. No token provided."
 *       403:
 *         description: Forbidden - Invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Invalid token."
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "fail"
 *               message: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               status: "error"
 *               message: "Failed to delete product"
 *               error: "Database connection error"
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete product',
      error: err.message,
    });
  }
};