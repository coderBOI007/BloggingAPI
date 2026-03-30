# Blogging API

A RESTful API for managing blog posts built with Node.js, Express.js and MongoDB.

## Features
- Create, read, update and delete blog posts
- User authentication and authorization with JWT
- Secure password hashing
- Protected routes for authenticated users only
- JSON responses with proper status codes

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed or MongoDB Atlas account

### Installation
```bash
git clone https://github.com/coderBOI007/blogging-api
cd blogging-api
npm install
```

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Run the app
```bash
npm start
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login and get token |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts | Get all posts |
| GET | /api/posts/:id | Get a single post |
| POST | /api/posts | Create a new post |
| PUT | /api/posts/:id | Update a post |
| DELETE | /api/posts/:id | Delete a post |

## Author
Boladale Ibrahim Oluwatosin
