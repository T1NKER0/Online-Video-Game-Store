import React, { useState } from 'react'; // lets react know that the "state" will change during runtime
import axios from 'axios'; // http requests - node.js
import { useNavigate } from 'react-router-dom'; // allows navigation from one component to another
import 'bootstrap/dist/css/bootstrap.min.css'; // style
import './App.css';  // Ensure to import the CSS file

// [param, setter]
// by using useState, we let React know that the value of param will be modified during runtime by setters
const Login = () => {
  const [signInEmail, setSignInEmail] = useState('');
  const [accessCredentials, setAccessCredentials] = useState('');
  const navigate = useNavigate(); //create navigation object 

  // submit info to node.js
  //React.FormEvent handles form submission or input field modifications
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); //prevents default page refresh when submitting form
    try {
      // http post request to node.js with login credentials
      const response = await axios.post('http://localhost:5000/api/login', { signInEmail, accessCredentials });
      localStorage.setItem('token', response.data.token); //stores value in local browser storage
      //redirect to home page, passing token
      navigate('/HomePage', { state: { token: response.data.token } });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="centered-container">
      {/* Login form */}
      <div
        style={{
          backgroundColor: 'transparent', // Remove white background
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          width: '400px', // Adjust the width of the login box
          backdropFilter: 'blur(10px)', // Add a subtle blur effect for readability
        }}
      >
        <h2 className="text-center mb-4" style={{ color: 'white' }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              className="form-control"
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={accessCredentials}
              onChange={(e) => setAccessCredentials(e.target.value)}
              className="form-control"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <button
          onClick={() => navigate('/')}
          className="btn btn-secondary w-100 mt-3"
        >
          Back to Main Page
        </button>
      </div>
    </div>
  );
}

export default Login;
