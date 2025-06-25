import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useNavigate, useLocation } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [token, setToken] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');

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
  const storedToken = localStorage.getItem('token');
  if (storedToken) {
    setToken(storedToken);

    // Fetch genres
    fetch('http://localhost:5000/api/gameTypes')
      .then(response => response.json())
      .then(data => {
        if (data.genres) {
          setGenres(data.genres.map((g: any) => g.genre_name)); // Asume que cada género tiene una propiedad 'name'
        }
      })
      .catch(err => console.error('Error fetching genres:', err));
  } else {
    navigate('/login'); //redirect to login
  }
}, [location.state]);



  const handleSearch = () => {
    if (searchText.trim()) {
      navigate('/search-results', {
        state: { query: searchText, token }, // pass token if needed
      });
    }
  };

   const handleGenreSubmit = () => {
    if (selectedGenre) {
      navigate('/genre-games', {
  state: { query: selectedGenre, token },
});
    }
  };

  const wishlist = () => {
      navigate('/Wishlist', { state: { query: localStorage.getItem('player') } });
  };

  const purchased = () => {
      navigate('/Purchased', { state: { query: localStorage.getItem('player') } });
  };

  return (
    <div className="home-page">
      <div className="logout-container">
         <button className="homepage-search-btn" onClick={purchased}>
            Purchased
          </button>
        <button className="homepage-search-btn" onClick={wishlist}>
            Wishlist
          </button>
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

          <h3>View games by genre</h3>
          <select
            className="form-select mt-3"
            aria-label="Genre select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Select a genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>

          <button
            className="btn btn-primary mt-2"
            onClick={handleGenreSubmit}
            disabled={!selectedGenre}
          >
            Submit
          </button>

        </div>
      </div>
    </div>
  );
};

export default HomePage;
