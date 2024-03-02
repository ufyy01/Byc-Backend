# E-Commerce Backend Project

This project is a Node.js and Express.js-based backend for an e-commerce platform. It utilizes MongoDB as the database and provides CRUD RESTful APIs for managing products, users, cart, wishlist, blogs, and orders.

## Technologies Used

- Node.js
- Express.js
- MongoDB

## Installation

### Clone the repository:
   git clone <repository-url>
   
### Navigate to the project directory:
cd e-commerce-backend

### Install dependencies:
npm install

## Set up environment variables:

Create a .env file in the root directory and define the following variables:

PORT=3000 <br>
MONGODB_URI= 'your-mongodb-uri'

## Run the server:

npm run dev

## Usage
Once the server is up and running, you can make HTTP requests to the provided APIs to manage products, users, cart, wishlist, blogs, and orders.

## Endpoints
### Products:

GET /api/products - Retrieve all products <br>
GET /api/products/:id - Retrieve a specific product by ID <br>
POST /api/products - Create a new product <br>
PUT /api/products/:id - Update a product <br>
DELETE /api/products/:id - Delete a product <br>

### Users:

GET /api/users/:id - Retrieve a specific user by ID <br>
POST /api/users - Create a new user <br>
PUT /api/users/:id - Update a user <br>
DELETE /api/users/:id - Delete a user <br>

### Cart:

GET /api/cart/:userId - Retrieve the cart for a specific user <br>
POST /api/cart/:userId - Add an item to the cart for a specific user <br>
PUT /api/cart/:userId/:productId - Update the quantity of an item in the cart for a specific user <br>
DELETE /api/cart/:userId/:productId - Remove an item from the cart for a specific user <br>

### Wishlist:

GET /api/wishlist/:userId - Retrieve the wishlist for a specific user <br>
POST /api/wishlist/:userId - Add a product to the wishlist for a specific user <br>
DELETE /api/wishlist/:userId/:productId - Remove a product from the wishlist for a specific user <br>

### Blogs:

GET /api/blogs - Retrieve all blogs <br>
GET /api/blogs/:id - Retrieve a specific blog by ID <br>
POST /api/blogs - Create a new blog <br>
PUT /api/blogs/:id - Update a blog <br>
DELETE /api/blogs/:id - Delete a blog <br>

### Orders:

GET /api/orders/:userId - Retrieve all orders for a specific user <br>
POST /api/orders/:userId - Create a new order for a specific user <br>
GET /api/orders/:userId/:orderId - Retrieve a specific order for a specific user <br>
PUT /api/orders/:userId/:orderId - Update an order for a specific user <br>
DELETE /api/orders/:userId/:orderId - Cancel an order for a specific user <br>

## Contributing
Contributions are welcome. Please submit a pull request explaining the changes you've made.
