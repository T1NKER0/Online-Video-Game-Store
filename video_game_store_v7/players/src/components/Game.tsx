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

const Game = () => {
  const location = useLocation();
  const { game } = location.state || {};
  const navigate = useNavigate();
  const player = localStorage.getItem("player");

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
      return;
    }

    if (!player || !game?.game_id) {
      console.warn("Missing player or game data.");
      return;
    }

    const checkWishlist = async () => {
      console.log("Checking wishlist for:", { player, gameId: game.game_id });

      try {
        const response = await axios.post('http://localhost:5000/api/check-wishlist', {
          player,
          game: game.game_id,
        });

        console.log("Check response:", response.data);

        if (response.status === 200 && response.data.game) {
          setIsInWishlist(true);
        } else {
          setIsInWishlist(false);
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setIsInWishlist(false);
          } else {
            console.error('Axios error during wishlist check:', err.message);
          }
        } else {
          console.error("Unexpected error checking wishlist:", err);
        }
      }
    };

    checkWishlist();
  }, [player, game?.game_id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!player || !game?.game_id) {
        console.warn("Missing player or game info for wishlist action.");
        return;
      }

      if (isInWishlist) {
        // Remove from wishlist
        await axios.post('http://localhost:5000/api/remove-wishlist', {
          player,
          game: game.game_id,
        });
        setIsInWishlist(false);
      } else {
        // Add to wishlist
        const response = await axios.post('http://localhost:5000/api/wishlist', {
          player,
          game: game.game_id,
        });
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        setIsInWishlist(true);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Wishlist action error:', err.response?.data || err.message);
      } else {
        console.error('Unexpected error during wishlist action:', err);
      }
    }
  };

  if (!game) return <p style={{ color: 'white' }}>No game data provided.</p>;

  return (
    <div className="game-detail" style={{ padding: '2rem', color: 'white' }}>
      <h2>{game.title}</h2>

      <div className="game-description">
        <h4>{game.description}</h4>
      </div>

      <div
        className="game-card"
        style={{
          backgroundColor: '#1f1f1f',
          borderRadius: '12px',
          padding: '1rem',
          width: '400px',
          margin: 'auto',
          textAlign: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
        }}
      >
        <img
          src={game.image_url}
          alt={`${game.title} cover`}
          style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }}
        />
        <p><strong>Genre:</strong> {game.genre}</p>
        <p><strong>Developer:</strong> {game.developer}</p>
        <p><strong>Price:</strong> ${game.price}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#005eff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Purchase
          </button>

          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#005eff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </form>
        </div>
      </div>

      <button
        onClick={() => navigate('/search-results', { state: { query: game.title } })}
        style={{
          position: 'absolute',
          top: '800px',
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

export default Game;
