import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


// Game type: blueprint for objects returned by the API
type Game = {
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

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
    }
  }, []);

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
    Add to Wishlist
  </button>
</div>

      </div>

      <button
        onClick={() => navigate('/search-results', { state: {query: game.title }})}
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
