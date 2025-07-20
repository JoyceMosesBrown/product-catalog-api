# Product Catalog API
A RESTful e-commerce backend built with Node.js, Express, and MongoDB. This project includes:

JWT-based authentication

Role-based access control 

Product and category management

Shopping cart and order functionality

Swagger-based API documentation

## Project Structure
## ├── controllers/
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── adminController.js
## ├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Cart.js
│   └── Order.js
## ├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── adminRoutes.js
## ├── middleware/
│   └── authMiddleware.js
## ├── config/
 │   └── db.js
 ├── app.js
 └── .env

## Getting Started

1. Clone the repository
git clone <your-repo-url>
cd product-catalog-api

2. Install dependencies
npm install

3. Configure environment variables
Create a .env file in the root directory with the following:
PORT=5000
MONGO_URI=mongodb://localhost:27017/product_catalog
JWT_SECRET=your_jwt_secret

4. Start the server
 For development 
npm run dev

 For production
npm start
The server will run on http://localhost:5000

## API Documentation
Interactive Swagger documentation is available at:

http://localhost:5000/api-docs/

Authentication Flow
Endpoint	Method	Description
/api/auth/register	POST	Register a new user
/api/auth/login	POST	Login and receive JWT token

Users receive a token on login.

Include the token in request headers for all protected routes:

Authorization: Bearer <your_token>
Product Management
Only authenticated users or admins can create, update, or delete products.

##  API Endpoints

---

###   Product Endpoints

| Endpoint             | Method | Description                           |
|----------------------|--------|---------------------------------------|
| /api/products        | GET    | Get all products or search            |
| /api/products        | POST   | Add a new product (auth required)     |
| /api/products/:id    | GET    | Get product by ID                     |
| /api/products/:id    | PUT    | Update product (auth required)        |
| /api/products/:id    | DELETE | Delete product (auth required)        |

---

###  Cart Endpoints

| Endpoint                | Method | Description                         |
|-------------------------|--------|-------------------------------------|
| /api/cart               | GET    | Fetch current user's cart           |
| /api/cart               | POST   | Add a product to the cart           |
| /api/cart/:itemId       | PUT    | Update quantity of a cart item      |
| /api/cart/:itemId       | DELETE | Remove an item from the cart        |

---

###  Order Endpoints

| Endpoint                  | Method | Description                                 |
|---------------------------|--------|---------------------------------------------|
| /api/orders               | POST   | Place an order from the current cart        |
| /api/orders               | GET    | Get all orders (admin only)                 |
| /api/orders/my            | GET    | Get all orders of the current user          |
| /api/orders/:id           | GET    | Get a specific order by ID                  |
| /api/orders/:id/status    | PUT    | Update order status (admin only)            |

---

###   Admin Endpoints

| Endpoint                    | Method | Description                             |
|-----------------------------|--------|-----------------------------------------|
| /api/admin/users            | GET    | Get all users (admin only)              |
| /api/admin/users/:id        | DELETE | Delete a user (admin only)              |
| /api/orders/:id/status      | PUT    | Update order status (admin only)        |



## Status Codes
Code	Description
200	Success
201	Created
400	Bad Request
401	Unauthorized

## Testing
I used Postman to test endpoints. Example requests and responses are available in the Swagger UI.

## Limitations
No image or file uploads

Roles are fixed 

JWT-based authentication only

## Video Walkthrough
Link: https://youtu.be/AFFqwbsftQQ










