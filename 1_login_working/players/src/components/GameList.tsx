import React, { useEffect, useState } from 'react';
import GameCard from './GameCard';
import axios from 'axios';

type Game = {
  id: number;
  title: string;
  description: string;
  price: number;
  developer: string;
  imageUrl: string;
};

const GameList = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const response = await axios.get('http://localhost:5000/api/games');
      setGames(response.data);
    };

    fetchGames();
  }, []);

  return (
    <div>
      <h2>Game List</h2>
      <div className="game-list">
        {games.map((game) => (
          <GameCard key={game.id} {...game} />
        ))}
      </div>
    </div>
  );
};

export default GameList;
