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

## Deployment on Railway

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
- Ensure MongoDB is running
- Check MONGO_URI in `.env`
- Verify IP whitelist on MongoDB Atlas

### Token invalid
- Clear browser localStorage
- Log out and log back in
- Verify JWT_SECRET is set

### CORS errors
- Check backend CORS is enabled
- Verify VITE_API_URL is correct
- Ensure frontend/backend URLs match

### API calls failing
- Verify backend is running (`npm run dev`)
- Check browser console for errors
- Confirm authentication token exists

## Deployment (Railway)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/team-task-manager.git
git push -u origin main
```

### Step 2: Deploy Backend on Railway
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo → choose the `backend` folder as root
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`
4. Railway auto-detects Node.js and runs `npm start`
5. Copy the public URL (e.g. `https://team-task-manager-backend.up.railway.app`)

### Step 3: Deploy Frontend on Railway
1. New service in same project → select repo → choose `frontend` folder
2. Add env variable: `VITE_API_URL=https://your-backend-url.railway.app/api`
3. Set build command: `npm run build`
4. Set start command: `npx serve dist`
5. Done!

---

## Features

- **User Auth** — JWT-based login/signup with hashed passwords (bcrypt)
- **Role-Based Access** — Admins create/delete tasks; Members can only update status
- **Project Management** — Create projects, add/remove members by email
- **Task Management** — Title, description, due date, priority (Low/Medium/High), status, assignment
- **Dashboard** — Total tasks, by status, overdue count, tasks per user
- **Overdue Detection** — Visual warnings on tasks past due date

---

## Database Schema

```
User: { name, email, password(hashed) }

Project: { name, description, admin(ref:User), members([ref:User]) }

Task: {
  title, description, dueDate, priority, status,
  project(ref:Project), assignedTo(ref:User), createdBy(ref:User)
}
```
