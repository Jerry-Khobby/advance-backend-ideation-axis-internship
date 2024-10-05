# User and Product Management API 

This is a RESTful API built using Node.js and Express for managing users and products. It supports creating, reading, updating, and deleting users and products, with features like validation, pagination, filtering, sorting, and rate-limiting for security. 

## Features 
- User creation with validation (username, email, password)
- CRUD operations for Users and Products
- Pagination, filtering, and sorting for retrieving users and products
- Rate limiting for creating new users
- Error handling and validation
- Express.js framework with MongoDB for data storage
- Basic user authentication using email and password
- Product creation and management

## Technologies Used
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework for Node.js
- **MongoDB**: NoSQL database
- **bcrypt**: For password hashing
- **express-rate-limit**: For rate-limiting endpoints
- **Mongoose**: ODM for MongoDB

---

## Installation

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (local or hosted instance like MongoDB Atlas)

### Setup Instructions
1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-repo/user-product-api.git
    cd user-product-api
    ```

2. **Install Dependencies**:
    Navigate to the root directory of the project and run:
    ```bash
    npm install
    ```

3. **Create Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   ```

4. **Run the Application**:  
   To start the server, run:
   ```bash
   node index.js
   ```
   The API will be running on `http://localhost:3000`.

---

## API Documentation

### User Endpoints

- **POST /create-user**  
  Create a new user.

  **Request Body**:
  ```json
  {
    "username": "string",
    "email": "email@example.com",
    "password": "password123!"
  }
  ```

- **GET /users**  
  Retrieve all users with pagination, filtering, and sorting options.

  **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of users per page (default: 10)
  - `username`: Filter by username (optional)
  - `email`: Filter by email (optional)
  - `sortBy`: Sort by field (e.g., `createdAt`) (optional)
  - `sortOrder`: Sort order (`asc` or `desc`)

- **GET /users/:id**  
  Retrieve a single user by their ID.

- **PUT /users/:id**  
  Update an existing user by their ID.

  **Request Body**:
  ```json
  {
    "username": "newUsername",
    "email": "newEmail@example.com"
  }
  ```

- **DELETE /users/:id**  
  Delete a user by their ID.

---

### Product Endpoints

- **POST /products**  
  Create a new product.

  **Request Body**:
  ```json
  {
    "name": "productName",
    "description": "productDescription",
    "price": 99.99
  }
  ```

- **GET /products**  
  Retrieve all products with pagination, filtering, and sorting options.

  **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Number of products per page (default: 10)
  - `name`: Filter by product name (optional)
  - `price`: Filter by product price (optional)
  - `sortBy`: Sort by field (e.g., `createdAt`) (optional)
  - `sortOrder`: Sort order (`asc` or `desc`)

- **GET /products/:id**  
  Retrieve a single product by its ID.

- **PATCH /products/:id**  
  Update an existing product by its ID.

  **Request Body**:
  ```json
  {
    "name": "newProductName",
    "description": "newProductDescription",
    "price": 149.99
  }
  ```

- **DELETE /products/:id**  
  Delete a product by its ID.

---

## Rate Limiting
The `/create-user` endpoint is rate-limited to 5 requests per 15 minutes per IP address to prevent abuse.

---

## Error Handling
Common HTTP status codes used in the API:
- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate resource
- **500 Internal Server Error**: Server-side issues

---

## Testing the API
You can use [Postman](https://www.postman.com/) or `curl` to test the API endpoints.

Example using `curl` to create a new user:

```bash
curl --location --request POST 'http://localhost:5000/create-user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "Test123!"
}'
```

---

## Deployment on Render
To deploy the API on [Render](https://render.com), follow these steps:

1. **Create a new Web Service** on Render.
2. **Link your GitHub repository**.
3. **Set the environment variables** in the Render dashboard.
4. **Deploy your app**. Render will automatically install your dependencies and start the server.

For hosting the API documentation using Swagger:

1. In your `index.js` (or `app.js`), add Swagger configuration:
   ```js
   const swaggerUi = require('swagger-ui-express');
   const swaggerDocument = require('./swagger.json');

   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   ```

2. Create a `swagger.json` file for your API specification.

3. Visit `/api-docs` to view the documentation.

---

## Contributing
Feel free to fork the repository and make changes. Pull requests are always welcome.

---

## License
This project is licensed under the MIT License.

```text
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


