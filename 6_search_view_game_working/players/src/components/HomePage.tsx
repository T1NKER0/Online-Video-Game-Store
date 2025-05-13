import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
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


  const handleSearch = () => {
    if (searchText.trim()) {
      navigate('/search-results', {
        state: { query: searchText, token }, // pass token if needed
      });
    }
  };

  return (
    <div className="home-page">
      <div className="logout-container">
        <button
          onClick={() => {
            localStorage.removeItem('token'); // Clear token on logout
            navigate('/');
          }}
          className="logout-btn"
        >
          Logout
        </button>
      </div>

      <div className="home-content">
        <h1 className="homepage-title">PlayStation Store</h1>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search games..."
            className="homepage-search"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="homepage-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
