import "./App.css";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  
  // State to store user information
  const [userstate, setUserState] = useState({});

  return (
    <div className="App">
      {/* Router component to handle routing */}
      <Router>
        {/* Routes component to define different routes */}
        <Routes>
          {/* Route for home page */}
          <Route
            path="/"
            element={
              // Render Profile component if user is logged in, else render Login component
              userstate && userstate._id ? (
                <Profile
                  setUserState={setUserState}
                  username={userstate.fname}
                  _id={userstate._id}
                />
              ) : (
                <Login setUserState={setUserState} />
              )
            }
          ></Route>
          {/* Route for login page */}
          <Route
            path="/login"
            element={<Login setUserState={setUserState} />}
          ></Route>
          {/* Route for signup page */}
          <Route path="/signup" element={<Register />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
