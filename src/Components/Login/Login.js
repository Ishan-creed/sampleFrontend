import React, { useState } from "react";
import basestyle from "../Base.module.css"; // Importing common styles
import loginstyle from "./Login.module.css"; // Importing Login component specific styles
import axios from "axios"; // Importing axios for making HTTP requests
import { useNavigate, NavLink } from "react-router-dom"; // Importing useNavigate and NavLink from react-router-dom

// Login component
const Login = ({ setUserState }) => {
  const navigate = useNavigate(); // Getting navigate function from useNavigate
  const [formErrors, setFormErrors] = useState({}); // State to hold form errors
  const [user, setUserDetails] = useState({ // State to hold user details
    email: "",
    password: "",
  });

  // Function to handle input changes
  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...user,
      [name]: value,
    });
  };

  // Function to validate form fields
  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i; // Regex for email validation
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required";
    }
    return error;
  };

  // Function to handle login
  const loginHandler = (e) => {
    e.preventDefault();
    const errors = validateForm(user); // Validating form fields
    setFormErrors(errors); // Setting form errors

    if (Object.keys(errors).length === 0) {
      // If no errors, proceed with login
      axios
        .post("http://localhost:5000/auth/login", user) // Making POST request to login endpoint
        .then((res) => {
          alert(res.data.message); // Alerting the response message
          const userData = res.data.user; // Getting user data from response
          setUserDetails({ ...user, _id: userData._id }); // Setting user details
          setUserState(userData); // Setting user state
          localStorage.setItem('userData', JSON.stringify(userData)); // Storing user data in local storage
          navigate("/", { replace: true }); // Navigating to home page
        })
        .catch((error) => {
          console.error("Error logging in:", error); // Logging error if any
        });
    }
  };
  
  return (
    <div className={loginstyle.login}>
      <form>
        <h1>Login</h1>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          onChange={changeHandler}
          value={user.email}
        />
        <p className={basestyle.error}>{formErrors.email}</p>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          onChange={changeHandler}
          value={user.password}
        />
        <p className={basestyle.error}>{formErrors.password}</p>
        <button className={basestyle.button_common} onClick={loginHandler}>
          Login
        </button>
      </form>
      <NavLink to="/signup">Not yet registered? Register Now</NavLink>
    </div>
  );
};

export default Login;
