# MERN Stack To-Do Application

A simple To-Do application built with the MERN stack (MongoDB, Express.js, React, and Node.js). This application allows users to add, view, and delete to-do items.

## Features

- ✅ Add new to-do items
- 📋 View all to-do items
- 🗑️ Delete to-do items
- 🔄 Real-time updates

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **HTTP Client**: Axios

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Project Structure

```
todo-application/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   ├── vercel.json        # Vercel deployment configuration
│   └── env.example        # Environment variables example
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── package.json       # Frontend dependencies
│   └── vercel.json        # Vercel deployment configuration
├── package.json           # Root package.json with scripts
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd todo
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (you can copy from `env.example`):
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/todoapp
   ```

   **For MongoDB Atlas:**
   - Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free cluster
   - Get your connection string
   - Replace `MONGODB_URI` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
   ```

   **Environment Variables:**
   - `PORT` (optional): Server port, defaults to 5000
   - `MONGODB_URI` (required): MongoDB connection string

4. Start the backend server:
```bash
npm start
```

   Or for development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the frontend directory for production API URL:
   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```
   - In development, the frontend defaults to `http://localhost:5000`
   - For production, set `REACT_APP_API_URL` to your backend URL
   - If not set, it defaults to `http://localhost:5000`

4. Start the React development server:
```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

## API Endpoints

### GET /todos
Fetch all to-do items (sorted by creation date, newest first).

**Response:**
```json
[
  { 
    "_id": "507f1f77bcf86cd799439011", 
    "text": "Learn MERN Stack", 
    "createdAt": "2024-01-01T00:00:00.000Z" 
  },
  { 
    "_id": "507f1f77bcf86cd799439012", 
    "text": "Build a To-Do App", 
    "createdAt": "2024-01-01T00:00:00.000Z" 
  }
]
```

**Error Response (500):**
```json
{
  "error": "Database error",
  "message": "Error message details"
}
```

### POST /todos
Add a new to-do item.

**Request Body:**
```json
{
  "text": "New To-Do Item"
}
```

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "text": "New To-Do Item",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- **400 Bad Request** (if text is empty):
```json
{
  "error": "Text is required"
}
```

- **500 Internal Server Error:**
```json
{
  "error": "Error creating todo",
  "message": "Error message details"
}
```

### DELETE /todos/:id
Delete a to-do item by ID.

**Example:**
```
DELETE /todos/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "message": "Todo deleted successfully",
  "todo": { 
    "_id": "507f1f77bcf86cd799439011", 
    "text": "New To-Do Item", 
    "createdAt": "2024-01-01T00:00:00.000Z" 
  }
}
```

**Error Responses:**
- **400 Bad Request** (if ID is invalid):
```json
{
  "error": "Invalid todo ID"
}
```

- **404 Not Found** (if todo doesn't exist):
```json
{
  "error": "Todo not found"
}
```

- **500 Internal Server Error:**
```json
{
  "error": "Error deleting todo",
  "message": "Error message details"
}
```

### GET /
Get API information and available endpoints.

**Response:**
```json
{
  "message": "Todo API is running!",
  "endpoints": {
    "GET /todos": "Fetch all todos",
    "POST /todos": "Create a new todo",
    "DELETE /todos/:id": "Delete a todo by ID"
  }
}
```

## Running the Application

### Quick Start (Run Both Frontend and Backend Together)

1. **Install all dependencies** (if not already installed):
   ```bash
   npm run install:all
   ```

2. **Start MongoDB** (if using local MongoDB):
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017`

3. **Run both frontend and backend together**:
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and frontend (port 3000) simultaneously.

4. **Open your browser** and navigate to `http://localhost:3000`

### Alternative: Run Separately

If you prefer to run them in separate terminals:

1. **Start the Backend Server**:
   ```bash
   npm run backend
   # or
   cd backend && npm start
   ```

2. **Start the Frontend** (in a new terminal):
   ```bash
   npm run frontend
   # or
   cd frontend && npm start
   ```

## Troubleshooting

### Backend Issues

- **MongoDB Connection Error**: 
  - Ensure MongoDB is running (if using local MongoDB)
  - Check your `.env` file has the correct `MONGODB_URI`
  - For MongoDB Atlas, ensure your IP is whitelisted

- **Port Already in Use**:
  - Change the `PORT` in `.env` file
  - Or stop the process using port 5000

### Frontend Issues

- **Cannot connect to backend**:
  - Ensure the backend server is running on port 5000
  - Check the `REACT_APP_API_URL` environment variable matches your backend URL
  - In development, the proxy in `package.json` should handle this automatically
  - For production, set `REACT_APP_API_URL` to your deployed backend URL
  - Check CORS settings in the backend allow your frontend origin

## Development Notes

- The backend uses CORS to allow requests from the frontend
  - Allowed origins: `http://localhost:3000` (development) and your production frontend URL
- The frontend is configured to proxy requests to `http://localhost:5000` in development (via `proxy` in `package.json`)
- All todos are stored in MongoDB with automatic timestamps
- The backend uses optimized MongoDB connection handling for serverless environments (Vercel)

## Deployment

### Deploying to Vercel

This application is configured for deployment on Vercel.

#### Backend Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: (Optional, Vercel handles this automatically)

3. **Deploy the backend:**
   - Point Vercel to the `backend` directory
   - Vercel will use `vercel.json` for configuration

#### Frontend Deployment

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - `REACT_APP_API_URL`: Your deployed backend URL (e.g., `https://your-backend.vercel.app`)

3. **Deploy the frontend:**
   - Point Vercel to the `frontend` directory
   - Build command: `npm run build`
   - Output directory: `build`

#### CORS Configuration

After deploying, update the CORS configuration in `backend/server.js` to include your production frontend URL:

```javascript
origin: [
  'http://localhost:3000',
  'https://your-frontend.vercel.app'
]
```

## License

This project is open source and available under the MIT License.

