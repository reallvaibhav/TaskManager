================================================================================
                         TEAM TASK MANAGER
================================================================================

A full-stack web application for managing team projects and tasks with 
role-based access control. Users can create projects, assign tasks, track 
progress, and manage team members with Admin/Member roles.

================================================================================
FEATURES
================================================================================

- User authentication with JWT tokens
- Create projects and manage team members
- Create, assign, and track tasks
- Dashboard with statistics and overdue tasks
- Role-based access (Admin can manage all, Members can update assigned tasks)

================================================================================
TECH STACK
================================================================================

Backend:   Node.js + Express + MongoDB
Frontend:  React 18 + Vite + React Router
Auth:      JWT + bcryptjs

================================================================================
SETUP & INSTALLATION
================================================================================

PREREQUISITES:
- Node.js v16+
- MongoDB (Atlas or local)

BACKEND SETUP:
  cd backend
  npm install
  
  Create .env file:
  MONGO_URI=mongodb://localhost:27017/taskmanager
  JWT_SECRET=your_secure_secret_key_here_min_32_chars
  PORT=5000
  NODE_ENV=development
  
  Start: npm run dev
  Backend runs on http://localhost:5000

FRONTEND SETUP:
  cd frontend
  npm install
  
  Create .env file:
  VITE_API_URL=http://localhost:5000/api
  
  Start: npm run dev
  Frontend runs on http://localhost:3000

================================================================================
DEPLOYMENT ON RAILWAY
================================================================================

STEP 1: Push to GitHub
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/TaskManager.git
  git branch -M main
  git push -u origin main

STEP 2: Deploy Backend on Railway
  1. Go to railway.app → New Project → Deploy from GitHub
  2. Select TaskManager repo
  3. Set root directory to: backend
  4. Add environment variables:
     - MONGO_URI: From MongoDB Atlas connection string
     - JWT_SECRET: Generate a secure key (32+ chars)
     - NODE_ENV: production
  5. Start command: node server.js
  6. Deploy and copy backend URL

STEP 3: Deploy Frontend on Railway
  1. In same Railway project → New Service
  2. Select TaskManager repo
  3. Set root directory to: frontend
  4. Build command: npm install && npm run build
  5. Start command: npx serve -s dist -l 3000
  6. Add environment variable:
     - VITE_API_URL: Your backend URL from Step 2
  7. Deploy

================================================================================
API ENDPOINTS
================================================================================

AUTH:
  POST /api/auth/register      - Register user
  POST /api/auth/login         - Login user

PROJECTS:
  GET /api/projects            - Get user's projects
  POST /api/projects           - Create new project
  POST /api/projects/:id/members    - Add member by email
  DELETE /api/projects/:id/members/:userId - Remove member

TASKS:
  GET /api/tasks               - Get all tasks
  GET /api/tasks/stats         - Get dashboard statistics
  POST /api/tasks              - Create task
  PUT /api/tasks/:id           - Update task
  DELETE /api/tasks/:id        - Delete task

================================================================================
TROUBLESHOOTING
================================================================================

MongoDB connection failed:
  - Ensure MongoDB is running
  - Check MONGO_URI in .env
  - Verify IP whitelist on MongoDB Atlas (0.0.0.0/0)

Token invalid:
  - Clear browser localStorage
  - Log out and log back in
  - Verify JWT_SECRET is set

CORS errors:
  - Check backend CORS is enabled
  - Verify VITE_API_URL is correct
  - Ensure frontend/backend URLs match

API calls failing:
  - Verify backend is running (npm run dev)
  - Check browser console for errors
  - Confirm authentication token exists

================================================================================
DATABASE SCHEMA
================================================================================

User: 
  { name, email, password(hashed), timestamps }

Project: 
  { name, description, admin(ref:User), members([ref:User]), timestamps }

Task: 
  { title, description, dueDate, priority, status, 
    project(ref:Project), assignedTo(ref:User), createdBy(ref:User), 
    timestamps }

Priority: Low, Medium, High
Status: To Do, In Progress, Done

================================================================================