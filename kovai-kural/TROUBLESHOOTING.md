# Troubleshooting Guide

## Issue: Can't see posts or categories from database

### Quick Fixes

#### 1. Check Backend is Running
```bash
cd backend
npm run dev
```
Should see: `Server running on port 5000` and `MongoDB connected`

#### 2. Test API Directly
```bash
cd backend
node test-api.js
```
This will test if the API endpoints are responding.

#### 3. Check Browser Console
Open DevTools (F12) → Console tab
Look for:
- ❌ Network errors (CORS, 404, 500)
- ❌ `Failed to fetch` errors
- ❌ Rate limit messages

#### 4. Check Network Tab
Open DevTools (F12) → Network tab
- Filter by "Fetch/XHR"
- Look for requests to `localhost:5000/api/posts` and `/api/categories`
- Check status codes (should be 200, not 429 or 500)

### Common Issues & Solutions

#### Issue: 429 Too Many Requests
**Cause:** Rate limiting blocking requests  
**Solution:** Already fixed - rate limiter now allows 500 requests/15min and skips GET requests

#### Issue: CORS Error
**Symptom:** `Access-Control-Allow-Origin` error in console  
**Solution:** 
```bash
# Backend should have cors() enabled
# Check backend/src/app.js has: app.use(cors())
```

#### Issue: MongoDB Connection Failed
**Symptom:** Backend logs show "MongoDB connection error"  
**Solutions:**
1. Check `.env` file has correct `MONGO_URI`
2. Verify MongoDB Atlas IP whitelist includes your IP
3. Check MongoDB Atlas credentials are correct
4. Try connection string in MongoDB Compass first

#### Issue: Empty Response (No Data)
**Symptom:** API returns `{ posts: [] }` or `{ categories: [] }`  
**Solution:** Database is empty - need to seed data
```bash
# Create test category via API or MongoDB Compass
# Then create test posts
```

#### Issue: Frontend Not Connecting to Backend
**Symptom:** Network tab shows no requests to localhost:5000  
**Solutions:**
1. Check frontend `.env` file exists with:
   ```
   VITE_API_BASE=http://localhost:5000
   ```
2. Restart frontend dev server after creating .env:
   ```bash
   cd frontend
   npm run dev
   ```

#### Issue: 401 Unauthorized
**Symptom:** Can't create posts/categories  
**Solution:** Need to login first - auth token required

### Verification Steps

1. **Test Backend Health**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"ok"}
   ```

2. **Test Categories Endpoint**
   ```bash
   curl http://localhost:5000/api/categories
   # Should return: {"categories":[...]}
   ```

3. **Test Posts Endpoint**
   ```bash
   curl http://localhost:5000/api/posts
   # Should return: {"posts":[...]}
   ```

4. **Check MongoDB Data**
   - Open MongoDB Compass
   - Connect with your MONGO_URI
   - Check `kovai-kural` database
   - Verify `posts` and `categories` collections have data

### Debug Mode

Enable detailed logging:

**Backend:**
```javascript
// In backend/src/app.js, ensure morgan is enabled:
app.use(morgan('dev'));
```

**Frontend:**
```javascript
// In frontend/src/services/api.js, add request interceptor:
instance.interceptors.request.use(req => {
  console.log('API Request:', req.method, req.url);
  return req;
});
```

### Still Not Working?

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Restart both servers**
3. **Check firewall** isn't blocking port 5000
4. **Try different browser**
5. **Check backend logs** for errors
6. **Verify Node.js version** (need 18+)

### Get Help

If issue persists, collect this info:
- Browser console errors (screenshot)
- Network tab showing failed requests
- Backend terminal logs
- MongoDB connection status
- Node.js version: `node --version`
- npm version: `npm --version`

Then open a GitHub issue with the above details.
