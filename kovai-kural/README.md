# Kovai Kural

A modern community discussion platform built with MERN stack.

## Features
- 🔐 User authentication & authorization
- 📝 Create posts with multiple images
- 💬 Comments with voting system
- 👥 Follow/unfollow users
- 🔔 Real-time notifications (Socket.io)
- 🎨 Dark/Light theme toggle
- 🔍 Search functionality
- 📂 Category-based organization
- 👤 User profiles with customization
- 🛡️ Admin panel
- ⚡ Rate limiting & input validation

## Tech Stack
**Backend:** Node.js, Express, MongoDB, Socket.io  
**Frontend:** React, Vite, TailwindCSS, React Router  
**Authentication:** JWT  
**File Upload:** Multer

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Project Structure
```
kovai-kural/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Auth, error handling
│   │   ├── utils/          # Validators, helpers
│   │   └── config/         # Database config
│   └── uploads/            # User uploaded files
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API & Socket services
│   │   └── styles/         # CSS files
└── docs/                   # Documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/me` - Update profile
- `POST /api/users/me/password` - Change password
- `POST /api/users/:id/follow` - Follow user
- `POST /api/users/:id/unfollow` - Unfollow user

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `POST /api/posts` - Create post
- `GET /api/posts/:id` - Get single post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/like` - Like/unlike post

### Comments
- `POST /api/posts/:id/comments` - Add comment
- `POST /api/comments/:id/vote` - Vote on comment

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (admin)

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/kovai-kural
JWT_SECRET=your-secret-key
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

## Testing
See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing instructions.

## Troubleshooting
See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) if you encounter issues.

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment guide.

## Security Features
- JWT authentication
- Password hashing (bcrypt)
- Rate limiting (100 req/15min per IP)
- Input validation & sanitization
- CORS protection
- Helmet security headers
- File upload validation

## Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License
ISC

## Support
For issues and questions, please open a GitHub issue.
