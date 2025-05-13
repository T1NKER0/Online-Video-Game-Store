import React, { useState } from 'react'; 
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css'; 

const Login = () => {
  const [signInEmail, setSignInEmail] = useState('');
  const [accessCredentials, setAccessCredentials] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // create navigation object 

  // submit info to node.js
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent default page refresh when submitting form
    try {
      // POST request to node.js with login credentials
      const response = await axios.post('http://localhost:5000/api/login', { signInEmail, accessCredentials });

      // Store the token in localStorage after successful login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); 
        navigate('/home-page'); // redirect to HomePage
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="centered-container">
      <div
        style={{
          backgroundColor: 'transparent',
          padding: '40px',
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          width: '400px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: 'white' }}>Login</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
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
};

export default Login;
