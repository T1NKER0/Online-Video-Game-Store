import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './HomePage.css'; // Import CSS for the page

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    console.log(storedToken);
     if (storedToken) {
      setToken(storedToken);
    }
    else if (storedToken == null)
    {
      navigate('/login'); //redirect to login
    }
  }, [location.state]
);

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    
    if (!token) {
      // If there's no token, redirect to login page
      navigate('/login');
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from storage
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className="home-container">
      <h1>PSN Admin Dash</h1>

      {/* User Management Button */}
      <Link to="/manage-users">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          User Management
        </button>
      </Link>

       {/* Content Management Button */}
       <Link to="/manage-content">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Content Management
        </button>
      </Link>

      {/* Logout Button */}
      <button 
        onClick={handleLogout} 
        className="btn btn-danger inline-block w-fit px-4 py-2 ml-3"
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
