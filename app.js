const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', require('./routes/authRoutes'));       
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Product Catalog API',
      version: '1.0.0',
      description: 'API documentation for the Product Catalog with JWT authentication',
      contact: {
        name: 'API Support',
        email: 'support@yourcompany.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'http://localhost:5000', 
        description: 'Alternative development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    './routes/*.js', 
    './controllers/*.js',  
    './models/*.js'
  ],
};


const swaggerSpec = swaggerJsdoc(swaggerOptions);

const swaggerSetup = swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Product Catalog API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
    docExpansion: 'list', 
    defaultModelsExpandDepth: 2,
  },
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));