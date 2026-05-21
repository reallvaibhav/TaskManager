# Vercel Deployment Guide - Team Task Manager

## What's New: Serverless Architecture

This project has been restructured for **Vercel serverless deployment**. Here's what changed:

### Directory Structure Changes

```
TaskManager/
├── api/                           # Vercel serverless functions
│   ├── auth/
│   │   ├── register.js           # POST /api/auth/register
│   │   └── login.js              # POST /api/auth/login
│   ├── projects/
│   │   ├── index.js              # GET/POST /api/projects
│   │   ├── members.js            # POST/DELETE /api/projects/:id/members
│   │   └── users/
│   │       └── all.js            # GET /api/projects/users/all
│   └── tasks/
│       ├── index.js              # GET/POST /api/tasks
│       ├── stats.js              # GET /api/tasks/stats
│       └── id.js                 # PUT/DELETE /api/tasks/:id
├── lib/                           # Shared backend utilities
│   ├── db.js                     # MongoDB connection manager
│   ├── auth.js                   # JWT verification
│   ├── utils.js                  # Helper functions
│   ├── User.js                   # User model
│   ├── Project.js                # Project model
│   └── Task.js                   # Task model
├── frontend/                      # React frontend (Vite)
├── vercel.json                    # Vercel configuration
└── package.json                   # Root dependencies for backend
```

### Key Changes

1. **Backend as Serverless Functions** - No more `backend/` directory. Functions are in `/api` folder
2. **Shared Libraries** - Models and utilities in `/lib` folder, imported by `/api` functions
3. **Unified Deployment** - Both frontend and backend deploy on single Vercel project
4. **MongoDB Connection Pooling** - Each serverless function optimizes DB connections
5. **CORS Handled** - All requests from same origin (no cross-origin issues)

---

## Step 1: Set Up MongoDB Atlas (Database)

### 1. Create Free MongoDB Account
- Go to https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Sign up or login with GitHub

### 2. Create a Cluster
- Choose "M0 Sandbox" (FREE tier)
- Select a region (choose one close to you)
- Click "Create Cluster" and wait 1-3 minutes

### 3. Create Database User
- Go to "Database Access" (left sidebar)
- Click "Add New Database User"
- Username: `taskmanager` (or any name)
- Password: Create a strong password (save it!)
- Role: "Atlas admin" is fine for free tier
- Click "Add User"

### 4. Set Network Access
- Go to "Network Access" (left sidebar)
- Click "Allow Access from Anywhere"
- Click "0.0.0.0/0" and confirm
- (This allows connections from Vercel servers)

### 5. Get Connection String
- Click "Databases" tab
- Click "Connect" on your cluster
- Choose "Drivers" option
- Copy the connection string
- It looks like: `mongodb+srv://username:password@cluster.mongodb.net/mydb?retryWrites=true&w=majority`
- **Replace**:
  - `username` with your database user (e.g., `taskmanager`)
  - `password` with the password you created
  - `mydb` with `taskmanager` (database name)

**Final example:**
```
mongodb+srv://taskmanager:mypassword123@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority
```

---

## Step 2: Deploy to Vercel

### 1. Open Vercel Dashboard
- Go to https://vercel.com
- Sign in with GitHub (if not already)

### 2. Create New Project
- Click "Add New..." → "Project"
- Select GitHub repository: `reallvaibhav/TaskManager`
- Click "Import"

### 3. Configure Project Settings

**Framework Preset:** Select "Other" (it's a custom full-stack app)

**Root Directory:** Leave empty (uses project root)

**Build and Output Settings:**
- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `npm install`

### 4. Add Environment Variables

Click "Environment Variables" and add:

| Variable | Value |
|----------|-------|
| `MONGO_URI` | Your MongoDB connection string from Step 1 |
| `JWT_SECRET` | Generate a random 32+ character string. Copy-paste this into a terminal to generate one: `openssl rand -base64 32` |

**Don't forget to click "Add" after each variable!**

### 5. Deploy
- Review settings
- Click "Deploy"
- Wait 3-5 minutes for build and deployment to complete
- Once done, you'll see a ✓ and a live URL like: `https://task-manager-abc123.vercel.app`

---

## Step 3: Test Your Deployment

### 1. Visit Your Live URL
- Open the URL provided by Vercel
- You should see the login page

### 2. Create a Test Account
- Click "Register"
- Fill in Name, Email, Password
- Click "Register"
- You should be logged in automatically

### 3. Test Main Features
- Click "Projects" → "Create Project"
- Enter a project name and create it
- Click on the project
- Create a task
- Update the task status
- Go back to Dashboard and verify statistics

### 4. Troubleshooting Deployment

**Error: "Cannot GET /"**
- Check Vercel build logs for errors
- Ensure `vercel.json` is in root directory
- Verify build command succeeded

**Error: "Connected to MongoDB failed"**
- Check `MONGO_URI` environment variable is set correctly
- Verify MongoDB Atlas connection string is correct
- Ensure IP whitelist (0.0.0.0/0) is set

**Error: "Invalid token" or login fails**
- Clear browser cache: Ctrl+Shift+Delete
- Verify `JWT_SECRET` is set in Vercel
- Check server logs in Vercel dashboard

**API returning 401 or 404**
- Check browser DevTools → Network tab
- Verify requests go to `/api/*` paths
- Check Vercel serverless function logs

### 5. View Deployment Logs
- In Vercel dashboard, go to your project
- Click "Deployments"
- Click the latest deployment
- Click "Functions" to see serverless function logs
- Click "Logs" to see build/runtime logs

---

## API Endpoints (After Deployment)

All endpoints available at your Vercel URL (e.g., `https://your-app.vercel.app/api/...`):

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `POST /api/projects/:id/members` - Add member by email
- `DELETE /api/projects/:id/members/:userId` - Remove member
- `GET /api/projects/users/all` - List all users

### Tasks
- `GET /api/tasks` - List tasks
- `GET /api/tasks/stats` - Get statistics
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

---

## Local Development (Before Deployment)

### Run Locally with Express Backend

```bash
# Install dependencies at root
npm install

# Terminal 1 - Start backend
cd backend
npm install
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000
Backend runs on http://localhost:5000

The frontend .env.local automatically points to `http://localhost:5000/api`

---

## GitHub Repository

Code is at: https://github.com/reallvaibhav/TaskManager

### Push New Changes
```bash
git add .
git commit -m "Your message"
git push origin main
```

Vercel automatically redeploys when you push to main branch!

---

## Common Vercel Deployment Issues

### Issue: Build fails with "cannot find module"
**Solution:** Ensure all dependencies are in root `package.json`

### Issue: Frontend can't reach backend
**Solution:** Frontend and backend are same origin on Vercel, no CORS issues. But verify API URLs in browser DevTools.

### Issue: Database connection timeout
**Solution:** Check MongoDB Atlas Network Access allows 0.0.0.0/0, and connection string includes database name

### Issue: Stuck on login or getting 401 errors
**Solution:** 
- Clear localStorage: Press F12 → Application → Local Storage → clear
- Check token is valid by logging in again
- Verify JWT_SECRET environment variable is set

---

## Next Steps: Recording Demo Video

1. Test all features on live URL
2. Open your phone/camera recording app or screen recorder
3. Record 2-5 minute demo:
   - Register a new user
   - Create a project
   - Add a team member
   - Create a task
   - Update task status
   - View dashboard
4. Upload video to YouTube (unlisted) or Google Drive
5. Share the link

---

## Submission Checklist

- ✅ Live URL from Vercel deployment
- ✅ GitHub repository: https://github.com/reallvaibhav/TaskManager
- ✅ README.md with setup and deployment instructions (in repo)
- ✅ Demo video (2-5 min) uploaded to YouTube or Drive
- ✅ All 4 items ready to submit

---

## Support

For Vercel specific help:
- https://vercel.com/docs

For MongoDB questions:
- https://docs.mongodb.com/manual/

For React + Vite:
- https://react.dev
- https://vitejs.dev
