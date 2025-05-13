import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css'; // Import CSS for the page

const ManageGenres = () => {
  const navigate = useNavigate();

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
      <h1>Manage Games</h1>

      {/* Add Game Button */}
      <Link to="/add-game">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Add Game
        </button>
      </Link>

       {/* Modify Genre */}
       <Link to="/modify-game">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Modify Game
        </button>
      </Link>

      {/* User Management Button */}
      <Link to="/remove-genre">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Remove Game
        </button>
      </Link>

      {/* User Management Button */}
      <Link to="/manage-content">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Back to Manage Content
        </button>
      </Link>
    </div>
  );
};

export default ManageGenres;
