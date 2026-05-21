# Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control. Users can create projects, assign tasks, track progress, and manage team members with Admin/Member roles.

## Features

- User authentication with JWT tokens
- Create projects and manage team members
- Create, assign, and track tasks
- Dashboard with statistics and overdue tasks
- Role-based access (Admin can manage all, Members can update assigned tasks)

## Tech Stack

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React 18 + Vite + React Router
- **Auth**: JWT + bcryptjs

## Setup & Installation

### Prerequisites
- Node.js v16+
- MongoDB (Atlas or local)

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_secure_secret_key_here_min_32_chars
PORT=5000
NODE_ENV=development
```

Start backend:
```bash
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Deployment on Vercel

### Prerequisites
- GitHub account (code already pushed to https://github.com/reallvaibhav/TaskManager.git)
- MongoDB Atlas account (for cloud database)
- Vercel account (free tier available)

### Step 1: Set Up MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create a free account or login
3. Create a new project and cluster (free M0 tier)
4. In "Database Access", create a database user (username/password)
5. In "Network Access", add IP 0.0.0.0/0 (allow all IPs)
6. Click "Connect" and copy the connection string
7. Replace `<username>`, `<password>`, and `<database>` in the connection string

Example: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager`

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `reallvaibhav/TaskManager`
4. Select "Other" as framework (since it's a custom full-stack app)
5. In "Root Directory", leave it empty (uses root)
6. In "Build Settings":
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
   - Install Command: `npm install`

7. In "Environment Variables", add:
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Generate a secure key (min 32 characters)

8. Click "Deploy" and wait for the build to complete

### Step 3: Verify Deployment

1. After successful deployment, Vercel provides a live URL (e.g., `https://task-manager-xyz.vercel.app`)
2. Visit the URL in your browser
3. Test the application:
   - Register a new user
   - Login
   - Create a project
   - Create a task
   - Update task status

### Live URL Format

Your deployed app will be at: `https://[your-project-name].vercel.app`

### Environment Variables Setup

Vercel automatically provides these to serverless functions at `/api/*`:
- `MONGO_URI` - MongoDB connection string (required)
- `JWT_SECRET` - JWT signing secret (required)

These are NOT needed in frontend .env (handled by Vercel backend)

---

## Local Development (Old Setup)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/TaskManager.git
git branch -M main
git push -u origin main
```

### Step 2: Set Up MongoDB

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add MongoDB plugin
4. Copy MongoDB connection string

### Step 3: Deploy Backend

1. In Railway, create new service
2. Connect your GitHub repository
3. Set root directory to `backend`
4. Add environment variables:
   - `MONGO_URI`: From MongoDB plugin
   - `JWT_SECRET`: Generate a secure key
   - `NODE_ENV`: `production`
5. Set start command: `node server.js`
6. Deploy

### Step 4: Deploy Frontend

1. Create another service in Railway
2. Set root directory to `frontend`
3. Build command: `npm install && npm run build`
4. Start command: `npx serve -s dist -l 3000`
5. Add environment variable:
   - `VITE_API_URL`: Your backend URL from Railway
6. Deploy

### Step 5: Connect Services

1. Copy backend URL from Railway
2. Update frontend `VITE_API_URL` with backend URL
3. Redeploy frontend

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `POST /api/projects/:id/members` - Add member by email
- `DELETE /api/projects/:id/members/:userId` - Remove member

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/stats` - Get dashboard statistics
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Troubleshooting

### MongoDB connection failed
- Ensure MongoDB connection string is correct
- Check `MONGO_URI` environment variable in Vercel dashboard
- Verify IP whitelist is set to 0.0.0.0/0 on MongoDB Atlas
- Ensure database user credentials are correct

### Token invalid / Login fails
- Clear browser localStorage: Press F12 → Application → localStorage → clear
- Log out and log back in
- Verify `JWT_SECRET` is set in Vercel environment variables
- Check browser console for error messages

### API calls failing / 401 errors
- Verify frontend can reach backend (check Network tab in DevTools)
- Ensure JWT token is being sent in Authorization header
- Verify backend environment variables are set correctly
- Check Vercel deployment logs for backend errors

### CORS errors
- All requests go through same Vercel domain, CORS is pre-configured
- If errors persist, check browser console for actual error message

### Frontend shows "Cannot GET /"
- Ensure `vercel.json` is configured correctly
- Check that build output directory is set to `frontend/dist`
- Verify frontend build succeeded in Vercel logs

