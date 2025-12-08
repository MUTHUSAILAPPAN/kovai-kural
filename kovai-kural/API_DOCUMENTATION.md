# API Documentation - Kovai Kural

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "handle": "johndoe"
}

Response: 201
{
  "token": "jwt_token_here",
  "user": { "_id", "name", "email", "handle", "role" }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200
{
  "token": "jwt_token_here",
  "user": { "_id", "name", "email", "handle", "role" }
}
```

## Users

### Get User Profile
```http
GET /users/:id

Response: 200
{
  "_id", "name", "handle", "bio", "avatar",
  "followersCount", "followingCount", "postsCount"
}
```

### Update Profile (Protected)
```http
PUT /users/me
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- name: string
- handle: string
- bio: string
- avatar: file (optional)

Response: 200
{ "user": {...} }
```

### Change Password (Protected)
```http
POST /users/me/password
Content-Type: application/json
Authorization: Bearer <token>

{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}

Response: 200
{ "message": "Password changed successfully" }
```

### Follow User (Protected)
```http
POST /users/:id/follow
Authorization: Bearer <token>

Response: 200
{ "message": "Followed successfully" }
```

### Unfollow User (Protected)
```http
POST /users/:id/unfollow
Authorization: Bearer <token>

Response: 200
{ "message": "Unfollowed successfully" }
```

### Get All Users (Admin Only)
```http
GET /users/all
Authorization: Bearer <token>

Response: 200
[{ "_id", "name", "email", "handle", "role", "createdAt" }]
```

## Posts

### Get All Posts
```http
GET /posts?page=1&limit=20&category=slug

Response: 200
{
  "docs": [...],
  "totalDocs": 100,
  "totalPages": 5,
  "currentPage": 1,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

### Create Post (Protected)
```http
POST /posts
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- title: string (required)
- content: string
- category: categoryId
- images: file[] (multiple)

Response: 201
{ "post": {...} }
```

### Get Single Post
```http
GET /posts/:id

Response: 200
{
  "_id", "title", "content", "images", "author",
  "category", "likes", "commentsCount", "createdAt"
}
```

### Update Post (Protected, Owner Only)
```http
PUT /posts/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Updated title",
  "content": "Updated content"
}

Response: 200
{ "post": {...} }
```

### Delete Post (Protected, Owner/Admin Only)
```http
DELETE /posts/:id
Authorization: Bearer <token>

Response: 200
{ "message": "Post deleted" }
```

### Like/Unlike Post (Protected)
```http
POST /posts/:id/like
Authorization: Bearer <token>

Response: 200
{ "liked": true/false, "likesCount": 10 }
```

## Comments

### Add Comment (Protected)
```http
POST /posts/:postId/comments
Content-Type: application/json
Authorization: Bearer <token>

{
  "content": "Great post!"
}

Response: 201
{ "comment": {...} }
```

### Vote on Comment (Protected)
```http
POST /comments/:id/vote
Content-Type: application/json
Authorization: Bearer <token>

{
  "type": "up" // or "down"
}

Response: 200
{ "votes": 5 }
```

### Get User Comments
```http
GET /users/:id/comments

Response: 200
[{ "_id", "content", "post", "votes", "createdAt" }]
```

## Categories

### Get All Categories
```http
GET /categories

Response: 200
[{ "_id", "title", "slug", "description", "postCount" }]
```

### Create Category (Admin Only)
```http
POST /categories
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Technology",
  "description": "Tech discussions"
}

Response: 201
{ "category": {...} }
```

### Get Category Posts
```http
GET /category/:slug/posts?page=1&limit=20

Response: 200
{
  "category": {...},
  "posts": { "docs": [...], "totalPages": 3, ... }
}
```

## Search

### Search Posts
```http
GET /search?q=keyword&page=1&limit=20

Response: 200
{
  "results": [...],
  "totalResults": 15
}
```

## Notifications

### Get Notifications (Protected)
```http
GET /notifications
Authorization: Bearer <token>

Response: 200
[{ "_id", "type", "message", "read", "createdAt" }]
```

### Mark as Read (Protected)
```http
PUT /notifications/:id/read
Authorization: Bearer <token>

Response: 200
{ "message": "Marked as read" }
```

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    { "msg": "Invalid email", "param": "email" }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided" 
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "message": "Too many requests, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Rate Limits
- 100 requests per 15 minutes per IP address
- Applies to all `/api/*` routes

## File Upload Limits
- Max file size: 5MB per file
- Allowed types: JPEG, PNG, WEBP, GIF
- Max files per post: 10 images
