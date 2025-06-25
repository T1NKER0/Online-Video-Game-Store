import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

type Game = {
  game_id: number;
  title: string;
  genre: string;
  description: string;
  developer: string;
  price: string;
  image_url: string;
};

const GenreGames = () => {
  const location = useLocation();
  const { query: selectedGenre } = location.state || {};
  const [games, setGames] = useState<Game[]>([]);
  const [purchasedGames, setPurchasedGames] = useState<number[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const player = localStorage.getItem("player");

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate('/login');
    }
  }, [location.state]);

  useEffect(() => {
    const getGames = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/genre-games', { selectedGenre });
        const gameList = response.data.games;
        setGames(gameList);

        if (player && Array.isArray(gameList)) {
          const checkPurchases = await Promise.all(
            gameList.map((game: Game) =>
              axios
                .post('http://localhost:5000/api/check-purchased', {
                  player,
                  game: game.game_id,
                })
                .then(res => (res.status === 200 && res.data.game ? game.game_id : null))
                .catch(() => null)
            )
          );

          const owned = checkPurchases.filter((id): id is number => id !== null);
          setPurchasedGames(owned);
        }
      } catch (err) {
        setError('Game not found or an error occurred.');
      }
    };

    if (selectedGenre) {
      getGames();
    }
  }, [selectedGenre, player]);

  return (
    <div className="search-results" style={{ padding: '2rem', color: 'white' }}>
      <h2>Search Results for "{selectedGenre}"</h2>
      {error && <p>{error}</p>}
      {games.length > 0 ? (
        <div className="game-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {games.map((game, index) => {
            const isPurchased = purchasedGames.includes(game.game_id);

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
                <p style={{ fontWeight: 'bold' }}>
                  {isPurchased ? 'Owned' : `$${game.price}`}
                </p>
                <button
                  onClick={() =>
                    navigate('/game', {
                      state: { game, token, fromGenres: true, selectedGenre },
                    })
                  }
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
                  {isPurchased ? 'View' : 'Get'}
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

export default GenreGames;
