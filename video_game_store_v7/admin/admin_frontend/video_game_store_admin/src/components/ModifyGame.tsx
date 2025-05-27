import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Game {
  game_id: number;
  title: string;
}

const ModifyGame: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  axios.get('http://localhost:5000/gameList')
    .then(response => {
      const gameList: Game[] = response.data.games || [];
      console.log('Received games:', gameList.map((game: Game) => game.title)); // ✅ typed explicitly
      setGames(gameList);
    })
    .catch(error => {
      console.error('Error fetching games:', error);
    });
}, []);


  const handleModifyGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGameId || !price.trim() || !description.trim() || !imageUrl.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/update-game/${selectedGameId}`, {
        price: parseFloat(price),
        description,
        imageUrl
      });

      alert('Game updated successfully.');
      setSelectedGameId('');
      setPrice('');
      setDescription('');
      setImageUrl('');
    } catch (error) {
      console.error('Error updating game:', error);
      alert('Failed to update game. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Modify Game</h2>
        <form onSubmit={handleModifyGame} className="form-group">
          <div className="mb-3">
            <label>Select Game</label>
            <select 
              className="form-control" 
              value={selectedGameId} 
              onChange={(e) => setSelectedGameId(e.target.value)} 
              required
            >
              <option value="">-- Select Game --</option>
              {games.map((game) => (
                <option key={game.game_id} value={game.game_id}>
                  {game.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="New Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="New Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="New Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Update Game</button>
          <button type="button" onClick={() => navigate('/manage-games')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default ModifyGame;
