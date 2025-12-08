# Testing Guide for New Features

## Prerequisites
- Backend running on `http://localhost:5000`
- Frontend running on `http://localhost:5173` (or your Vite port)
- At least 2 user accounts (one regular, one admin if testing admin features)

## 1. Follow/Unfollow System

### Steps:
1. Login as User A
2. Navigate to User B's profile: `/profile/{handle}`
3. Click the "Follow" button
4. Verify:
   - Button changes to "Unfollow"
   - Follower count increases by 1
5. Click "Unfollow"
6. Verify:
   - Button changes back to "Follow"
   - Follower count decreases by 1

### Expected Behavior:
- Button shows loading state ("...") while processing
- Changes are immediate (no page refresh needed)
- Cannot follow yourself (button doesn't appear on own profile)

---

## 2. Edit Profile

### Steps:
1. Login and go to your profile
2. Click "Edit profile" button
3. Modal opens with current profile data
4. Update any of:
   - Name
   - Handle (username)
   - Bio
   - Avatar (upload image file)
5. Click "Save"
6. Verify:
   - Modal closes
   - Profile updates immediately
   - Avatar appears if uploaded
   - Navbar shows updated name

### Expected Behavior:
- File size limit: 2MB for avatar
- Only image files accepted
- Handle must be unique
- Loading state shows "Saving..." on button
- Errors display in red box above form

---

## 3. Change Password

### Steps:
1. On your profile, click "Change Password"
2. Enter:
   - Current password
   - New password (min 6 characters)
   - Confirm new password
3. Click "Change Password"
4. Verify:
   - Success message appears in green
   - Modal closes after 1.5 seconds
5. Logout and login with new password

### Expected Behavior:
- Validates passwords match
- Validates minimum length (6 chars)
- Shows error if current password is wrong
- Success message before auto-close

---

## 4. Comment Voting

### Steps:
1. Go to any user's profile
2. Click "Comments" tab
3. Find a comment with vote arrows (▲ ▼)
4. Click upvote (▲)
5. Verify vote count increases
6. Click downvote (▼)
7. Verify vote count decreases

### Expected Behavior:
- Vote count updates after each click
- Comments list refreshes to show new count
- Requires authentication (login first)

---

## 5. Multiple Image Display

### Steps:
1. Create a new post
2. Upload 2-4 images
3. Submit post
4. View post in feed
5. Verify:
   - All images display in grid
   - Single image: 1 column
   - Multiple images: 2 columns
   - Images have rounded corners and gap

### Expected Behavior:
- Grid layout with 8px gap
- Images maintain aspect ratio
- Responsive design

---

## 6. Admin Panel

### Steps:
1. Login as user with ADMIN role
2. Verify "Admin" link appears in navbar
3. Click "Admin" link
4. View users table with:
   - Name
   - Handle
   - Email
   - Role
   - Join date
5. Try accessing `/admin` as non-admin user
6. Verify redirect to home page

### Expected Behavior:
- Only ADMIN role users see the link
- Table shows all users
- Non-admins cannot access the page
- Clean table layout with all user info

---

## Common Issues & Solutions

### Issue: "Failed to update profile"
- **Solution**: Check if handle is already taken by another user

### Issue: Images not displaying
- **Solution**: Verify backend uploads folder exists and is accessible at `/uploads`

### Issue: Follow button not working
- **Solution**: Ensure you're logged in and not on your own profile

### Issue: Admin link not showing
- **Solution**: Check user role in database - must be exactly "ADMIN"

### Issue: Comment votes not updating
- **Solution**: Verify backend comments route is registered in app.js

---

## API Endpoints Reference

```
POST   /api/users/:id/follow          - Follow a user
POST   /api/users/:id/unfollow        - Unfollow a user
PUT    /api/users/me                  - Update profile (multipart/form-data)
POST   /api/users/me/password         - Change password
POST   /api/comments/:id/vote         - Vote on comment (body: {type: 'up'|'down'})
GET    /api/users/all                 - Get all users (admin only)
GET    /api/users/:id/saved           - Get saved posts
GET    /api/users/:id/tagged          - Get tagged posts
GET    /api/users/:id/comments        - Get user's comments
```

---

## Browser Console Debugging

Open browser console (F12) to see:
- API request/response logs
- Error messages
- Network tab for failed requests
- React component errors

Look for:
- `401 Unauthorized` - Not logged in
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Invalid endpoint or ID
- `400 Bad Request` - Invalid data format
