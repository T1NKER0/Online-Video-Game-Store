import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Genre {
  genre_id: number;
  genre_name: string;
}

const CreateGame: React.FC = () => {
  const [title, setTitle] = useState('');
  const [developer, setDeveloper] = useState('');
  const [genreId, setGenreId] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [genres, setGenres] = useState<Genre[]>([]);
  const navigate = useNavigate();

  // Fetch genres for the dropdown
  useEffect(() => {
    axios.get('http://localhost:5000/gameTypes')
      .then(response => {
        setGenres(response.data.genres || []);
      })
      .catch(error => {
        console.error('Error fetching genres:', error);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/games', {
        title,
        developer,
        genre_id: genreId,
        price,
        description,
        image_url: imageUrl
      });
      navigate('/manage-content');
    } catch (err) {
      console.error('Error adding game:', err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Add New Game</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Game Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Developer" 
              value={developer} 
              onChange={(e) => setDeveloper(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <select 
              className="form-control" 
              value={genreId} 
              onChange={(e) => setGenreId(e.target.value)} 
              required
            >
              <option value="">-- Select Genre --</option>
              {genres.map((genre) => (
                <option key={genre.genre_id} value={genre.genre_id}>
                  {genre.genre_name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input 
              type="number" 
              step="0.01"
              className="form-control" 
              placeholder="Price" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <textarea 
              className="form-control" 
              placeholder="Description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Image URL" 
              value={imageUrl} 
              onChange={(e) => setImageUrl(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Add Game</button>
          <button type="button" onClick={() => navigate('/manage-content')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default CreateGame;
