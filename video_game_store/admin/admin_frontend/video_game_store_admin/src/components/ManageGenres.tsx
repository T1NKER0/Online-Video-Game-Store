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
      <h1>Manage Genres</h1>

      {/* Add Genre Button */}
      <Link to="/create-genre">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Create Genre
        </button>
      </Link>

       {/* Modify Genre */}
       <Link to="/modify-genre">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Modify Genre
        </button>
      </Link>

      {/* User Management Button */}
      <Link to="/delete-genre">
        <button className="btn btn-primary inline-block w-fit px-4 py-2">
          Delete Genre
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
