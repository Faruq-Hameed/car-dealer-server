
# Car Dealer Server

A RESTful API for managing a car dealership, built with Node.js, Express, and MongoDB.  
Supports user authentication, car and category management, and robust role-based access control.

---

## Features

- **User Registration & Authentication**
  - Register as customer or manager (role specified during onboarding)
  - Unique email and phone number validation
  - JWT-based authentication

- **Role-Based Access Control**
  - Only managers can add/update/delete categories and cars
  - Only the manager who added a category or car can update or delete it

- **Category Management**
  - Add, update, and delete categories
  - If a category has cars, deleting it only updates its status; otherwise, it is removed

- **Car Management**
  - Add, update, and delete cars (one at a time, scalable to multiple)
  - Cannot update or delete already sold cars

- **Pagination & Filtering**
  - Reusable pagination utility for all list endpoints
  - Flexible filtering by fields, including date range and price

- **Validation**
  - Joi-based request validation for all endpoints
  - Middleware for validating MongoDB ObjectIds

- **Security**
  - Helmet for HTTP headers
  - CORS enabled
  - Error handling middleware

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB

### Installation

```bash
git clone https://github.com/yourusername/car-dealer-server.git
cd car-dealer-server
npm install
```

### Environment Variables

Create a `.env` file in the root directory and set the following:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car-dealer
JWT_SECRET=your_jwt_secret
```

### Running the Server

```bash
npm run dev
```

---

## API Endpoints

### Auth

- `POST /api/v1/auths/register` — Register user (customer or manager)
- `POST /api/v1/auths/login` — Login

### Users

- `GET /api/v1/users` — List users (paginated, manager only)
- `PATCH /api/v1/users/:id` — Update user
- `DELETE /api/v1/users/:id` — Delete user

### Categories

- `POST /api/v1/categories` — Add category (manager only)
- `GET /api/v1/categories` — List categories (paginated)
- `PATCH /api/v1/categories/:id` — Update category (manager only)
- `DELETE /api/v1/categories/:id` — Delete category (manager only)

### Cars

- `POST /api/v1/cars` — Add car (manager only)
- `GET /api/v1/cars` — List cars (paginated, filterable)
- `PATCH /api/v1/cars/:id` — Update car (manager only, not if sold)
- `DELETE /api/v1/cars/:id` — Delete car (manager only, not if sold)

---

## Validation & Error Handling

- All endpoints use Joi for request validation.
- Custom exceptions for unauthorized, bad request, and conflict errors.
- Middleware for validating MongoDB ObjectIds.

---

## Pagination

All list endpoints support pagination via `page` and `limit` query parameters.  
Filtering and sorting are also supported.

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Notes

- Only a car can be added at a time, but the logic can be scaled for bulk operations.
- Already sold cars cannot be updated or deleted.
- If a category is in use, deleting it only updates its status.

---

**Happy coding! 🚗**ted