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
todo/
├── backend/
│   ├── server.js          # Express server and API routes
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables example
├── frontend/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styles
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Frontend dependencies
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

3. Create a `.env` file in the backend directory:
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

3. Start the React development server:
```bash
npm start
```

The frontend will automatically open in your browser at `http://localhost:3000`

## API Endpoints

### GET /todos
Fetch all to-do items.

**Response:**
```json
[
  { "_id": "1", "text": "Learn MERN Stack", "createdAt": "2024-01-01T00:00:00.000Z" },
  { "_id": "2", "text": "Build a To-Do App", "createdAt": "2024-01-01T00:00:00.000Z" }
]
```

### POST /todos
Add a new to-do item.

**Request Body:**
```json
{
  "text": "New To-Do Item"
}
```

**Response:**
```json
{
  "_id": "3",
  "text": "New To-Do Item",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /todos/:id
Delete a to-do item by ID.

**Example:**
```
DELETE /todos/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "message": "Todo deleted successfully",
  "todo": { "_id": "3", "text": "New To-Do Item", "createdAt": "2024-01-01T00:00:00.000Z" }
}
```

## Running the Application

1. **Start MongoDB** (if using local MongoDB):
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017`

2. **Start the Backend Server**:
   ```bash
   cd backend
   npm start
   ```

3. **Start the Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

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
  - Check the `API_URL` in `App.js` matches your backend URL
  - Check CORS settings in the backend

## Development Notes

- The backend uses CORS to allow requests from the frontend
- The frontend is configured to proxy requests to `http://localhost:5000` in development
- All todos are stored in MongoDB with automatic timestamps

## License

This project is open source and available under the MIT License.

