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
  const { game, playerFromState, fromWishlist, fromPurchased, fromGenres, selectedGenre } = location.state || {};
  const navigate = useNavigate();
  const player = playerFromState || localStorage.getItem("player");

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isPurchased, setPurchased] = useState(false);

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

    const checkPurchased = async () => {
      console.log("Checking wishlist for:", { player, gameId: game.game_id });

      try {
        const response = await axios.post('http://localhost:5000/api/check-purchased', {
          player,
          game: game.game_id,
        });

        console.log("Check response:", response.data);

        if (response.status === 200 && response.data.game) {
          setPurchased(true);
        } 
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setPurchased(false);
          } else {
            console.error('Axios error during purchase check:', err.message);
          }
        } else {
          console.error("Unexpected error checking purchase:", err);
        }
      }
    };
    checkWishlist();
    checkPurchased();
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
        await axios.post('http://localhost:5000/api/remove-from-wishlist', {
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

  const handlePurchase = async () => {
    console.log("Purchase button clicked");
  try {
    if (!player || !game?.game_id) {
      console.warn("Missing player or game info for purchase action.");
      return;
    }

    if (!isPurchased) {
      await axios.post('http://localhost:5000/api/purchased', {
        player,
        game: game.game_id,
      });
      setPurchased(true);
      // Remove from wishlist
        await axios.post('http://localhost:5000/api/remove-from-wishlist', {
          player,
          game: game.game_id,
        });
    } 
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Purchase action error:', err.response?.data || err.message);
    } else {
      console.error('Unexpected error during purchase action:', err);
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
       {!isPurchased && (
  <p><strong>Price:</strong> ${game.price}</p>
)}


        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
  {!isPurchased ? (
    <button
      onClick={handlePurchase}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      Purchase
    </button>
  ) : (
    <span
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: 'gray',
        color: 'white',
        borderRadius: '6px',
        display: 'inline-block',
        lineHeight: '2.25rem',
      }}
    >
      Purchased
    </span>
  )}

    {!isPurchased && (
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
  )}

</div>

      </div>

      <button
  onClick={() => {
    if (fromWishlist) {
      navigate('/wishlist', { state: { query: player } });
    } else if (fromPurchased){
      navigate('/Purchased', { state: { query: player } });
    } else if (fromGenres){
      navigate('/genre-games', { state: { query: selectedGenre } });
    }else{
      navigate('/search-results', { state: { query: game.title } });
    }
  }}

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
