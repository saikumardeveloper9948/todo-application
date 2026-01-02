const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// ===== Middleware =====
app.use(cors({
  origin:  [
    'http://localhost:3000',
    
    'https://todo-application-zvi3.vercel.app'
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ===== MongoDB URI =====
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined');
}

// ===== MongoDB Connection (Vercel-safe) =====
const connectDB = async () => {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('✅ MongoDB already connected');
    return;
  }

  // Check if MONGODB_URI is defined
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Increased timeout
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    throw error;
  }
};

// ===== Todo Model =====
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

// ===== Routes =====
app.options('*', cors());


// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API is running!',
    endpoints: {
      'GET /todos': 'Fetch all todos',
      'POST /todos': 'Create a new todo',
      'DELETE /todos/:id': 'Delete a todo by ID',
    },
  });
});

// GET all todos
app.get('/todos', async (req, res) => {
  try {
    await connectDB();
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({
      error: 'Database error',
      message: error.message,
    });
  }
});

// POST new todo
app.post('/todos', async (req, res) => {
  try {
    await connectDB();
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const todo = new Todo({ text: text.trim() });
    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({
      error: 'Error creating todo',
      message: error.message,
    });
  }
});

// DELETE todo by ID
app.delete('/todos/:id', async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid todo ID' });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({
      message: 'Todo deleted successfully',
      todo: deletedTodo,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting todo',
      message: error.message,
    });
  }
});

// ===== Export for Vercel =====
module.exports = app;

// ===== Local development only =====
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  
  // Connect to MongoDB on server start (local development)
  (async () => {
    try {
      await connectDB();
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB on startup:', error.message);
      console.log('⚠️  Server will still start, but database operations may fail');
      console.log('💡 Make sure your .env file has MONGODB_URI defined');
    }
  })();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
