import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch all todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  // Fetch all todos from the backend
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching todos. Make sure the backend server is running.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter a todo item');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/todos`, { text: text.trim() });
      setTodos([response.data, ...todos]);
      setText('');
      setError('');
      toast.success('Todo added successfully!');
    } catch (err) {
      setError('Error adding todo');
      toast.error('Error adding todo');
      console.error('Error adding todo:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
      setError('');
      toast.success('Todo deleted successfully!');
    } catch (err) {
      setError('Error deleting todo');
      toast.error('Error deleting todo');
      console.error('Error deleting todo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="container">
        <h1>To-Do Application</h1>
        
        {error && <div className="error-message">{error}</div>}

        {/* Form to add new todo */}
        <form onSubmit={addTodo} className="todo-form">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a new to-do item..."
            className="todo-input"
            disabled={loading}
          />
          <button type="submit" className="add-button" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>

        {/* List of todos */}
        <div className="todos-container">
          {loading && todos.length === 0 ? (
            <p className="loading">Loading todos...</p>
          ) : todos.length === 0 ? (
            <p className="empty-message">No todos yet. Add one above!</p>
          ) : (
            <ul className="todo-list">
              {todos.map((todo) => (
                <li key={todo._id} className="todo-item">
                  <span className="todo-text">{todo.text}</span>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="delete-button"
                    disabled={loading}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

