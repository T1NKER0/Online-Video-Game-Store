import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


// Game type: blueprint for objects returned by the API
type Game = {
  game_id: number;
  title: string;
  genre: string;
  description: string;
  developer: string;
  price: string;
  image_url: string;
};

const Wishlist = () => {
  const location = useLocation();
  const { query } = location.state || {};
  const [games, setGames] = useState<Game[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
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
  const storedToken = localStorage.getItem('token');
  console.log("Stored token:", storedToken);

  if (storedToken) {
    setToken(storedToken);
  } else {
    navigate('/login');
  }
}, []);

useEffect(() => {
  console.log("Query received:", query); // 👈
  const searchGames = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/my-wishlist', { player: query });
      setGames(response.data.games); // ✅ recibir array
    } catch (err) {
      console.error(err);
      setError('Game not found or an error occurred.');
    }
  };

  if (query) {
    searchGames();
  }
}, [query]);


  return (
    <div className="search-results" style={{ padding: '2rem', color: 'white' }}>
      {error && <p>{error}</p>}
      {games.length > 0 ? (
        <div className="game-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {games.map((game, index) => {
      console.log('game object sent:', game);
      return (
        <div
          key={index}
          className="game-card"
          style={{
            backgroundColor: '#1f1f1f',
            borderRadius: '12px',
            padding: '1rem',
            width: '250px',
            textAlign: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
          }}
        >
          <img
            src={game.image_url}
            alt={`${game.title} cover`}
            style={{
              width: '100%',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          />
          <h3>{game.title}</h3>
          <p style={{ fontWeight: 'bold' }}>{game.price}</p>
          <button
            onClick={() => navigate('/game', { state: { game, token } })}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#005eff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Get
          </button>
        </div>
      );
    })}
  </div>
) : !error ? (
  <p>Loading...</p>
) : null}

<button
  onClick={() => navigate('/HomePage')}
  style={{
    position: 'absolute',
    top: '20px',
    left: '20px',
    padding: '10px 20px',
    backgroundColor: 'white',
    color: 'black',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    zIndex: 10,
  }}
>
  Back
</button>

    </div>

    
  );
};

export default Wishlist;
