# Deployment Guide - Kovai Kural

## Prerequisites
- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Domain name (optional, for production)

## Backend Deployment

### 1. Environment Setup
```bash
cd backend
cp .env.example .env
# Edit .env with production values
```

Required environment variables:
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Set to `production`
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Strong secret key (use: `openssl rand -base64 32`)

### 2. Install Dependencies
```bash
npm install --production
```

### 3. Start Server
```bash
npm start
```

### 4. Using PM2 (Recommended)
```bash
npm install -g pm2
pm2 start src/server.js --name kovai-kural-api
pm2 save
pm2 startup
```

## Frontend Deployment

### 1. Environment Setup
Create `.env` in frontend folder:
```
VITE_API_URL=https://your-api-domain.com
```

### 2. Build
```bash
cd frontend
npm install
npm run build
```

### 3. Serve Static Files
The `dist/` folder contains production build. Options:

**Option A: Using serve**
```bash
npm install -g serve
serve -s dist -p 3000
```

**Option B: Using nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/frontend/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Cloud Deployment Options

### Vercel (Frontend)
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Render (Backend)
1. Connect GitHub repo
2. Set build command: `cd backend && npm install`
3. Set start command: `cd backend && npm start`
4. Add environment variables

### Railway (Full Stack)
1. Connect GitHub repo
2. Add MongoDB service
3. Deploy backend and frontend separately

## Security Checklist
- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Configure CORS for production domain only
- [ ] Set up MongoDB authentication
- [ ] Enable rate limiting (already configured)
- [ ] Regular security updates: `npm audit fix`

## Monitoring
```bash
# View PM2 logs
pm2 logs kovai-kural-api

# Monitor performance
pm2 monit
```

## Backup Strategy
```bash
# MongoDB backup
mongodump --uri="$MONGO_URI" --out=/backup/$(date +%Y%m%d)

# Automated daily backup (crontab)
0 2 * * * mongodump --uri="$MONGO_URI" --out=/backup/$(date +\%Y\%m\%d)
```
