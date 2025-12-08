# Quick Start Guide

Get Kovai Kural running in 5 minutes!

## Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

## Step 2: Configure Environment

```bash
# Backend - already has .env, verify it has:
# - MONGO_URI (your MongoDB connection string)
# - JWT_SECRET (any random string)
# - PORT=5000

# Frontend - create .env file
cd frontend
echo VITE_API_BASE=http://localhost:5000 > .env
```

## Step 3: Seed Database (Optional but Recommended)

```bash
cd backend
npm run seed
```

This creates:
- Test user (email: `test@example.com`, password: `password123`)
- 3 sample categories
- 3 sample posts

## Step 4: Start Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Should see: "Server running on port 5000" and "MongoDB connected"

# Terminal 2 - Frontend
cd frontend
npm run dev
# Should see: "Local: http://localhost:5173"
```

## Step 5: Open Browser

Visit: `http://localhost:5173`

You should see:
- ✅ Categories in sidebar
- ✅ Posts in feed
- ✅ Login/Register buttons

## Test the App

1. **Login** with test credentials:
   - Email: `test@example.com`
   - Password: `password123`

2. **Create a post**:
   - Click "Create Post" button
   - Fill in title and content
   - Select a category
   - Submit

3. **Browse categories**:
   - Click on any category in sidebar
   - View posts in that category

## Troubleshooting

### Can't see posts/categories?

**Quick checks:**
```bash
# 1. Test backend API
cd backend
npm run test-api

# 2. Check browser console (F12)
# Look for errors in Console and Network tabs

# 3. Verify MongoDB connection
# Check backend terminal for "MongoDB connected"
```

**Common fixes:**
- Restart both servers
- Clear browser cache (Ctrl+Shift+Delete)
- Check `.env` files exist in both folders
- Verify MongoDB Atlas IP whitelist includes your IP

### Rate limit errors?

Already fixed! Rate limiter now:
- Allows 500 requests per 15 minutes
- Skips GET requests (reading data)
- Only limits POST/PUT/DELETE (writing data)

### Still having issues?

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed solutions.

## Next Steps

- Read [TESTING_GUIDE.md](./TESTING_GUIDE.md) to test all features
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API details
- See [PROJECT_COMPLETION_CHECKLIST.md](./PROJECT_COMPLETION_CHECKLIST.md) for roadmap

## Need Help?

Open an issue on GitHub with:
- Error messages from console
- Backend terminal logs
- Steps to reproduce the issue

Happy coding! 🚀
