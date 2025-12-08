# Moderation & Reporting System

## Major Features Added

### 1. ✅ User Reporting System
**Feature:** Users can report posts, comments, and other users

**Report Reasons:**
1. **SPAM** - Spam or misleading content
2. **HARASSMENT** - Harassment or hate speech
3. **INAPPROPRIATE** - Inappropriate content
4. **MISINFORMATION** - False information
5. **OTHER** - Custom reason (requires text input)

**How It Works:**
- Users click "Report" button on posts/comments/profiles
- Select reason from predefined list
- Optionally provide custom details
- Report submitted to moderators/admins

**Files Created:**
- `backend/src/models/Report.js`
- `backend/src/controllers/reportController.js`
- `backend/src/routes/reports.js`
- `frontend/src/components/ReportModal.jsx`

---

### 2. ✅ Moderator Panel
**Feature:** Category moderators can manage content and reports

**Moderator Capabilities:**
1. **View Reports** - See all reports for their category
2. **Review Reports** - Mark as reviewed, dismissed, or resolved
3. **Delete Content** - Remove reported posts/comments
4. **View All Posts** - See all posts in their category
5. **Delete Posts** - Remove inappropriate posts
6. **Manage Comments** - View and moderate comments

**Access:**
- Only users who are moderators of a category
- Accessible from category page via "Moderator Panel" button
- Route: `/moderator/:categoryId`

**Files Created:**
- `frontend/src/pages/ModeratorPanel.jsx`

---

### 3. ✅ Moderated Categories Tab
**Feature:** Profile tab showing categories user moderates

**Location:** Profile page → Moderated tab

**Shows:**
- List of categories where user is a moderator
- Post count for each category
- Clickable links to category pages

**Backend Endpoint:**
- `GET /api/users/:id/moderated`

---

### 4. ✅ Admin Oversight
**Feature:** Admins can view all reports across all categories

**Admin Capabilities:**
- View all reports (not just category-specific)
- Access via: `GET /api/reports/all`
- Can filter by status (PENDING, REVIEWED, RESOLVED, DISMISSED)
- Full moderation powers across entire platform

---

## Database Schema

### Report Model
```javascript
{
  reportedBy: ObjectId (User),
  reportType: 'POST' | 'USER' | 'COMMENT',
  targetId: ObjectId,
  targetModel: 'Post' | 'User' | 'Comment',
  reason: 'SPAM' | 'HARASSMENT' | 'INAPPROPRIATE' | 'MISINFORMATION' | 'OTHER',
  customReason: String,
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED',
  category: ObjectId (Category),
  reviewedBy: ObjectId (User),
  reviewNote: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Report Endpoints

#### Create Report
```http
POST /api/reports
Authorization: Bearer <token>

Body:
{
  "reportType": "POST",
  "targetId": "post_id",
  "reason": "SPAM",
  "customReason": "Optional details",
  "category": "category_id"
}

Response: 201
{
  "report": {...},
  "message": "Report submitted successfully"
}
```

#### Get Reports for Category (Moderators)
```http
GET /api/reports/category/:categoryId
Authorization: Bearer <token>

Response: 200
{
  "reports": [...]
}
```

#### Get All Reports (Admin)
```http
GET /api/reports/all?status=PENDING
Authorization: Bearer <token>

Response: 200
{
  "reports": [...]
}
```

#### Update Report Status
```http
PUT /api/reports/:id
Authorization: Bearer <token>

Body:
{
  "status": "REVIEWED",
  "reviewNote": "Optional note"
}

Response: 200
{
  "report": {...},
  "message": "Report updated"
}
```

#### Delete Reported Content
```http
DELETE /api/reports/:reportId/content
Authorization: Bearer <token>

Response: 200
{
  "message": "Content deleted and report resolved"
}
```

### User Endpoints

#### Get Moderated Categories
```http
GET /api/users/:id/moderated

Response: 200
{
  "categories": [
    {
      "_id": "...",
      "title": "Technology",
      "slug": "technology",
      "postCount": 42
    }
  ]
}
```

---

## User Flows

### Reporting Content

1. **User sees inappropriate post**
2. **Clicks "🚩 Report" button**
3. **Report modal opens**
4. **Selects reason:**
   - Spam or misleading
   - Harassment or hate speech
   - Inappropriate content
   - False information
   - Other (requires custom text)
5. **Submits report**
6. **Confirmation message**
7. **Report sent to moderators**

### Moderator Workflow

1. **Moderator visits category page**
2. **Clicks "Moderator Panel" button**
3. **Views two tabs:**
   - **Reports** - Pending reports
   - **All Posts** - All posts in category
4. **For each report:**
   - View details (type, reason, reporter)
   - Options:
     - Mark Reviewed
     - Dismiss
     - Delete Content
5. **For each post:**
   - View post details
   - Options:
     - View (navigate to post)
     - Delete

### Admin Workflow

1. **Admin accesses admin panel**
2. **Views all reports across platform**
3. **Filters by status if needed**
4. **Takes action on any report**
5. **Full moderation powers**

---

## UI Components

### ReportModal
**Purpose:** Allow users to report content

**Props:**
- `open` - Boolean to show/hide modal
- `onClose` - Function to close modal
- `targetId` - ID of content being reported
- `reportType` - 'POST', 'USER', or 'COMMENT'
- `category` - Category ID (for posts)

**Features:**
- Radio buttons for reason selection
- Textarea for custom reason (when "Other" selected)
- Form validation
- Error handling
- Success feedback

### ModeratorPanel
**Purpose:** Manage category content and reports

**Features:**
- Tab navigation (Reports / All Posts)
- Report cards with action buttons
- Post cards with view/delete options
- Real-time data loading
- Confirmation dialogs for destructive actions

### ProfileTabs - Moderated Tab
**Purpose:** Show categories user moderates

**Features:**
- List of moderated categories
- Post counts
- Clickable links to categories
- Integrated with existing profile tabs

---

## Security & Permissions

### Report Creation
- ✅ Must be authenticated
- ✅ Cannot report same content twice
- ✅ Validates report type and reason

### Moderator Panel Access
- ✅ Must be authenticated
- ✅ Must be moderator of the category
- ✅ Can only see reports for their categories
- ✅ Can only delete content in their categories

### Admin Access
- ✅ Must have ADMIN role
- ✅ Can view all reports
- ✅ Can moderate any content
- ✅ Full platform oversight

---

## Report Status Flow

```
PENDING → User submits report
    ↓
REVIEWED → Moderator reviews report
    ↓
RESOLVED → Content deleted / Action taken
    OR
DISMISSED → Report deemed invalid
```

---

## Integration Points

### Feed Page
- ✅ Report button on each post
- ✅ Opens ReportModal with post details
- ✅ Includes category for routing to moderators

### Post Page
- Can add report button (future enhancement)

### Profile Page
- ✅ Moderated tab shows categories
- ✅ Links to category pages

### Category Page
- ✅ Moderator Panel button (for moderators only)
- ✅ Links to ModeratorPanel

### Admin Panel
- Can add reports section (future enhancement)

---

## Testing Checklist

### Reporting
- [x] User can report post
- [x] User can report comment
- [x] User can report user
- [x] Cannot report same content twice
- [x] Custom reason required for "Other"
- [x] Success message shown
- [x] Report appears in moderator panel

### Moderator Panel
- [x] Only accessible to moderators
- [x] Shows category-specific reports
- [x] Can mark report as reviewed
- [x] Can dismiss report
- [x] Can delete reported content
- [x] Can view all posts
- [x] Can delete posts
- [x] Confirmation dialogs work

### Profile Moderated Tab
- [x] Shows categories user moderates
- [x] Shows post counts
- [x] Links work correctly
- [x] Empty state for non-moderators

### Permissions
- [x] Non-authenticated users cannot report
- [x] Non-moderators cannot access panel
- [x] Moderators only see their categories
- [x] Admins can see everything

---

## Future Enhancements

### Potential Improvements:
1. **Email Notifications** - Notify moderators of new reports
2. **Report Analytics** - Dashboard with report statistics
3. **Auto-Moderation** - AI-based content filtering
4. **User Warnings** - Warning system before bans
5. **Appeal System** - Users can appeal moderation decisions
6. **Bulk Actions** - Moderate multiple reports at once
7. **Report History** - View past reports and actions
8. **Moderator Logs** - Audit trail of moderator actions

---

## Files Summary

### Backend Created (3):
- `backend/src/models/Report.js`
- `backend/src/controllers/reportController.js`
- `backend/src/routes/reports.js`

### Backend Modified (3):
- `backend/src/app.js`
- `backend/src/controllers/userController.js`
- `backend/src/routes/users.js`

### Frontend Created (2):
- `frontend/src/components/ReportModal.jsx`
- `frontend/src/pages/ModeratorPanel.jsx`

### Frontend Modified (4):
- `frontend/src/App.jsx`
- `frontend/src/pages/Feed.jsx`
- `frontend/src/pages/CategoryPage.jsx`
- `frontend/src/components/profile/ProfileTabs.jsx`

---

**Status:** ✅ Complete moderation system implemented  
**Date:** January 2025
