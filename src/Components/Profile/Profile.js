import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import './ToDoList.css'; // Import CSS file for styling

function ToDoList({ history }) {

  // State variables
  const [todos, setTodos] = useState([]); // State for storing all todos
  const [inputValue, setInputValue] = useState(''); // State for input field value
  const [userId, setUserId] = useState(''); // State for storing user ID
  const [user, setUser] = useState(); // State for storing user data
  const [filteredTodos, setFilteredTodos] = useState([]); // State for storing filtered todos

  useEffect(() => {
    // Fetch user data from local storage
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUser(userData);
      const myId = userData._id;
      setUserId(myId);

      const url = `http://localhost:5000/todo/retrieve?userId=${userId}`;

      // Fetch todos from the server
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch todo items');
          }
          return response.json();
        })
        .then(data => {
          setTodos(data);
          setFilteredTodos(data);
        })
        .catch(error => {
          console.error('Error fetching todo items:', error);
        });
    } else {
      // If user data is not found, redirect to signin page
      history.push('/signin');
    }

    // Filter todos based on user ID
    const filtered = todos.filter(todo => todo.userId === userId);
    setFilteredTodos(filtered);
  }, [userId, history]);

  // Handle input change for filtering todos
  const handleInputChange = (e) => {
    const filtered = todos.filter(todo =>
      todo.text.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredTodos(filtered);
  };

  // Handle input change for adding new todo
  const handleInput1 = (e) => {
    setInputValue(e.target.value);
  }

  // Handle addition of new todo
  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      fetch(`http://localhost:5000/todo/count?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch todo count');
          }
          return response.json();
        })
        .then(countData => {
          const nextTodoId = countData.count + 1;

          fetch('http://localhost:5000/todo/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todoId: nextTodoId, text: inputValue, id: userId }),
          })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to add todo');
              }
              return response.json();
            })
            .then(newTodo => {
              setTodos([...todos, newTodo]);
              setFilteredTodos([...filteredTodos, newTodo]);
              setInputValue('');
            })
            .catch(error => {
              console.error('Error adding todo:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching todo count:', error);
        });
    }
  };

  // Handle deletion of todo
  const handleDeleteTodo = (id) => {
    fetch(`http://localhost:5000/todo/delete?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete todo');
        }

        // Update todos state after deleting todo
        setTodos(todos.filter(todo => todo._id !== id));
        // Also update filteredTodos
        setFilteredTodos(filteredTodos.filter(todo => todo._id !== id));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
      });
  };

  // Handle update of todo
  const handleUpdateTodo = (id, newText) => {
    fetch(`http://localhost:5000/todo/update?id=${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newText }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update todo');
        }

        // Update todos state after updating todo
        setTodos(todos.map(todo => {
          if (todo._id === id) {
            return { ...todo, text: newText };
          }
          return todo;
        }));

        // Update filteredTodos state after updating todo
        setFilteredTodos(filteredTodos.map(todo => {
          if (todo._id === id) {
            return { ...todo, text: newText };
          }
          return todo;
        }));
      })
      .catch(error => {
        console.error('Error updating todo:', error);
      });
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('userData');
    window.location.reload();
    history.push('/signin');
  };

  // Render JSX
  return (
    <div className="todo-container">
      {user && <h3 style={{ color: 'Blue' }}>Welcome {user.fname}</h3>}
      <button style={{ marginTop: "10px" }} onClick={handleLogout}>Logout</button>
      <h1 style={{ color: 'White' }}>To-Do List</h1>
      <div>
        <input type="text" placeholder="Filter tasks..." onChange={handleInputChange} />
        <input style={{ marginTop: "20px" }} type="text" value={inputValue} onChange={handleInput1} placeholder="Enter your task here" />
        <button onClick={handleAddTodo}>Add</button>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo._id}>
            <input
              type="text"
              value={todo.text}
              onChange={(e) => handleUpdateTodo(todo._id, e.target.value)}
            />
            <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
            <button onClick={() => handleUpdateTodo(todo._id)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
