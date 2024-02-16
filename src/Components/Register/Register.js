import React, { useEffect, useState } from "react";
import basestyle from "../Base.module.css"; // Importing common styles
import registerstyle from "./Register.module.css"; // Importing Register component specific styles
import axios from "axios"; // Importing axios for making HTTP requests
import { useNavigate, NavLink } from "react-router-dom"; // Importing useNavigate and NavLink from react-router-dom

// Register component
const Register = () => {
  const navigate = useNavigate(); // Getting navigate function from useNavigate
  const [formErrors, setFormErrors] = useState({}); // State to hold form errors
  const [isSubmit, setIsSubmit] = useState(false); // State to track form submission
  const [user, setUserDetails] = useState({ // State to hold user details
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
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
    if (!values.fname) {
      error.fname = "First Name is required";
    }
    if (!values.lname) {
      error.lname = "Last Name is required";
    }
    if (!values.email) {
      error.email = "Email is required";
    } else if (!regex.test(values.email)) {
      error.email = "This is not a valid email format!";
    }
    if (!values.password) {
      error.password = "Password is required";
    } else if (values.password.length < 4) {
      error.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      error.password = "Password cannot exceed more than 10 characters";
    }
    if (!values.cpassword) {
      error.cpassword = "Confirm Password is required";
    } else if (values.cpassword !== values.password) {
      error.cpassword = "Confirm password and password should be same";
    }
    return error;
  };

  // Function to handle form submission
  const signupHandler = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user)); // Validating form fields
    setIsSubmit(true); // Setting form submission status

    // If no errors, proceed with registration
  };

  // Effect to handle registration after form validation
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      // If no form errors and form is submitted
      axios.post("http://localhost:5000/auth/signup/", user) // Making POST request to signup endpoint
        .then((res) => {
          alert(res.data.message); // Alerting the response message
          navigate("/login", { replace: true }); // Navigating to login page
        })
        .catch((error) => {
          console.error("Error registering:", error); // Logging error if any
        });
    }
  }, [formErrors]); // Dependency array with formErrors

  return (
    <>
      <div className={registerstyle.register}>
        <form>
          <h1>Create your account</h1>
          <input
            type="text"
            name="fname"
            id="fname"
            placeholder="First Name"
            onChange={changeHandler}
            value={user.fname}
          />
          <p className={basestyle.error}>{formErrors.fname}</p>
          <input
            type="text"
            name="lname"
            id="lname"
            placeholder="Last Name"
            onChange={changeHandler}
            value={user.lname}
          />
          <p className={basestyle.error}>{formErrors.lname}</p>
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
          <input
            type="password"
            name="cpassword"
            id="cpassword"
            placeholder="Confirm Password"
            onChange={changeHandler}
            value={user.cpassword}
          />
          <p className={basestyle.error}>{formErrors.cpassword}</p>
          <button className={basestyle.button_common} onClick={signupHandler}>
            Register
          </button>
        </form>
        <NavLink to="/login">Already registered? Login</NavLink>
      </div>
    </>
  );
};

export default Register;
