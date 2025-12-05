# Kovai Kural — Developer README

Kovai Kural is a civic reporting platform for Coimbatore built using React + Vite (frontend) and Node.js + Express + MongoDB (backend). Follow the steps below to run the full application locally.

Clone the repository:

git clone <REPO_URL>
cd kovai-kural

Ensure you have Node.js 18+ and MongoDB installed. Install all dependencies by running:

cd backend && npm install
cd ../frontend && npm install

Create a `.env` file inside the `backend` folder with:

PORT=5000
MONGODB_URI=mongodb://localhost:27017/kovai-kural
JWT_SECRET=super-secret-key
CLIENT_ORIGIN=http://localhost:5173

Create a `.env` file inside the `frontend` folder with:

VITE_API_BASE=http://localhost:5000

Start the backend server (Terminal 1):

cd backend
npm run dev

Start the frontend application (Terminal 2):

cd frontend
npm run dev


Open the app in a browser:

http://localhost:3000


Register a new account → Login → Start using the platform. If you want to confirm backend is running, check:


curl http://localhost:5000/api/health

This should return:
{"status":"ok","service":"Kovai Kural Backend"}


If any issues occur:

* Make sure MongoDB MONGODB_URI to use Atlas
* Restart both servers after environment changes
* Clear browser localStorage if login fails
* Ensure the `backend/uploads/` folder exists for images

Kovai Kural is successfully running in your machine
