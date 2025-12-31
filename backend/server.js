const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false // Set to false when using origin: '*'
}));

// Handle preflight requests
app.options('*', cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

if (!process.env.MONGODB_URI) {
  console.warn('Warning: MONGODB_URI environment variable is not set. Using default local MongoDB.');
  console.warn('MONGODB_URI value:', process.env.MONGODB_URI || 'NOT SET');
}

// For Vercel serverless functions, we need to handle connection differently
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    isConnected = true;
    console.log('Connected to MongoDB successfully');
    console.log('MongoDB URI used:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide password in logs
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('MONGODB_URI is set:', !!process.env.MONGODB_URI);
    isConnected = false;
    throw error;
  }
};

// Connect to MongoDB
connectDB().catch(console.error);

// Todo Model
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', todoSchema);

// Routes

// GET / - Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo API is running!',
    endpoints: {
      'GET /todos': 'Fetch all todos',
      'POST /todos': 'Create a new todo',
      'DELETE /todos/:id': 'Delete a todo by ID'
    }
  });
});

// GET /todos - Fetch all to-do items
app.get('/todos', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB connection is not established. Please check MONGODB_URI environment variable.'
      });
    }
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ 
      error: 'Error fetching todos',
      message: error.message 
    });
  }
});

// POST /todos - Add a new to-do item
app.post('/todos', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB connection is not established. Please check MONGODB_URI environment variable.'
      });
    }
    
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const todo = new Todo({ text: text.trim() });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ 
      error: 'Error creating todo',
      message: error.message 
    });
  }
});

// DELETE /todos/:id - Delete a to-do item by ID
app.delete('/todos/:id', async (req, res) => {
  try {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: 'Database not connected',
        message: 'MongoDB connection is not established. Please check MONGODB_URI environment variable.'
      });
    }
    
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully', todo: deletedTodo });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ 
      error: 'Error deleting todo',
      message: error.message 
    });
  }
});

// Export the app for Vercel serverless functions
module.exports = app;

// Start server only if not in Vercel environment
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

