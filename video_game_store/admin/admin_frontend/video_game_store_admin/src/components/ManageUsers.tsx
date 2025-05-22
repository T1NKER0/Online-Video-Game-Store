import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './HomePage.css'; // Import CSS for the page

const ManageUsers = () => {
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

  return (
    <div className="home-container">
      <h1>Manage Users</h1>

      {/* User Management Button */}
      <Link to="/create-account">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Create User
        </button>
      </Link>

      {/* User Management Button */}
      <Link to="/delete-account">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Delete User
        </button>
      </Link>

       {/* User Management Button */}
       <Link to="/reset-password">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Reset Password
        </button>
      </Link>

      {/* User Management Button */}
      <Link to="/home-page">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default ManageUsers;
