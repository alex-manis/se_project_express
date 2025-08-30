# WTWR (What to Wear?):

Last updated: 2025‑08‑30

A backend API for managing clothing items and users. Users can create, like, and delete clothing items.

## Technologies

This project uses the following technologies and libraries:

- **Node.js** – JavaScript runtime for building the server
- **Express** – Web framework for handling routing and middleware
- **MongoDB** – NoSQL database for storing users and clothing items
- **Mongoose** – ODM (Object Data Modeling) library for MongoDB
- **Validator** – Library for validating data (e.g., URLs)
- **ESLint** – Linter for code quality and style
- **Prettier** – Code formatter
- **Postman** – Tool for testing API endpoints

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
```

2. Navigate to the project folder:

```bash
cd se_project_express
```

3. Install dependencies:

```bash
npm install
```

4. Make sure MongoDB is running locally (default port 27017).

5. Start the server:

```bash
npm start
```

The API will be available at `http://localhost:3001`.

---

## API Endpoints

### Authentication

- **POST /signup** – Create a new user
- **POST /signin** – Log in and receive a JWT token

**Request body example (/signup):**

```json
{
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg",
  "email": "john@example.com",
  "password": "strongpassword123"
}
```

**Response example (/signup):**

```json
{
  "data": {
    "_id": "64f0c7f4a3d2b1a234567890",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "email": "john@example.com"
  }
}
```

**Request body example (/signin):**

```json
{
  "email": "john@example.com",
  "password": "strongpassword123"
}
```

**Response example (/signin):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Users

- **GET /user/me** – Get current user
- **PATCH /users/me** – Update current user (name and avatar)

**Request body example (PATCH /users/me):**

```json
{
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response example (GET /users/me):**

```json
{
  "data": {
    "_id": "64f0c7f4a3d2b1a234567890",
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg",
    "email": "john@example.com"
  }
}
```

---

### Clothing Items

- **GET /clothingItems** – Get all items
- **POST /clothingItems** – Create a new item
- **DELETE /clothingItems/:itemId** – Delete an item
- **PUT /clothingItems/:itemId/likes** – Like an item
- **DELETE /clothingItems/:itemId/likes** – Unlike an item

**POST request body example:**

```json
{
  "name": "T-Shirt",
  "weather": "hot",
  "imageUrl": "https://example.com/tshirt.jpg"
}
```

**POST /clothingItems response example:**

```json
{
  "data": {
    "_id": "64f0c8a1a3d2b1a234567891",
    "name": "T-Shirt",
    "weather": "hot",
    "imageUrl": "https://example.com/tshirt.jpg",
    "owner": "64f0c7f4a3d2b1a234567890",
    "likes": [],
    "createdAt": "2025-08-25T10:00:00.000Z"
  }
}
```

**PUT /clothingItems/:itemId/likes response example:**

```json
{
  "data": {
    "_id": "64f0c8a1a3d2b1a234567891",
    "name": "T-Shirt",
    "weather": "hot",
    "imageUrl": "https://example.com/tshirt.jpg",
    "owner": "64f0c7f4a3d2b1a234567890",
    "likes": ["64f0c7f4a3d2b1a234567890"],
    "createdAt": "2025-08-25T10:00:00.000Z"
  }
}
```

**DELETE /clothingItems/:itemId/likes response example:**

```json
{
  "data": {
    "_id": "64f0c8a1a3d2b1a234567891",
    "name": "T-Shirt",
    "weather": "hot",
    "imageUrl": "https://example.com/tshirt.jpg",
    "owner": "64f0c7f4a3d2b1a234567890",
    "likes": [],
    "createdAt": "2025-08-25T10:00:00.000Z"
  }
}
```

---

## Error Handling

- `400` – Bad request: invalid data or invalid ID
- `401` – Unauthorized: invalid or missing JWT token
- `403` – Forbidden: trying to delete another user’s item
- `404` – Not found: user/item does not exist or route does not exist
- `409` – Conflict: duplicate email during signup
- `500` – Internal server error

All error responses have the format:

```json
{
  "message": "Error message here"
}
```

---

## Notes

- All created clothing items are linked to a user via the `owner` field.
- Likes are stored as an array of user IDs.
- The API returns updated item objects when likes are added or removed.
- For list endpoints, empty arrays are returned when no data exists.
- Authentication is required for all routes except /signup and /signin.
