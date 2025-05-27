import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Game {
  game_id: number;
  title: string;
}

const DeleteGame: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState('');
  const navigate = useNavigate();

  // Fetch genres from backend
  useEffect(() => {
    axios.get('http://localhost:5000/gameList')
      .then(response => {
        setGames(response.data.genres || []);
      })
      .catch(error => {
        console.error('Error fetching games:', error);
      });
  }, []);

  // Handle genre deletion
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGame) {
      alert('Please select a game to delete.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/delete-game/${selectedGame}`);
      alert('Genre deleted successfully.');

      setGames(games.filter(genre => genre.game_id !== parseInt(selectedGame)));
      setSelectedGame('');
    } catch (err) {
      console.error('Error deleting genre:', err);
      alert('Failed to delete genre. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Delete Game</h2>
        <form onSubmit={handleDelete} className="form-group">
          <div className="mb-3">
            <label>Select Game</label>
            <select 
              className="form-control" 
              value={selectedGame} 
              onChange={(e) => setSelectedGame(e.target.value)} 
              required
            >
              <option value="">-- Select Game --</option>
              {games.map((genre) => (
                <option key={genre.game_id} value={genre.game_id}>
                  {genre.title}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-danger w-100">Delete Game</button>
          <button type="button" onClick={() => navigate('/manage-games')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default DeleteGame;
