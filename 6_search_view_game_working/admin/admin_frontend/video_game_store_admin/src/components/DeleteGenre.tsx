import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Genre {
  genre_id: number;
  genre_name: string;
}

const DeleteGenre: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const navigate = useNavigate();

  // Fetch genres from backend
  useEffect(() => {
    axios.get('http://localhost:5000/gameTypes')
      .then(response => {
        setGenres(response.data.genres || []);
      })
      .catch(error => {
        console.error('Error fetching genres:', error);
      });
  }, []);

  // Handle genre deletion
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGenre) {
      alert('Please select a genre to delete.');
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/delete-type-of-game/${selectedGenre}`);
      alert('Genre deleted successfully.');

      setGenres(genres.filter(genre => genre.genre_id !== parseInt(selectedGenre)));
      setSelectedGenre('');
    } catch (err) {
      console.error('Error deleting genre:', err);
      alert('Failed to delete genre. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Delete Genre</h2>
        <form onSubmit={handleDelete} className="form-group">
          <div className="mb-3">
            <label>Select Genre</label>
            <select 
              className="form-control" 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)} 
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
          <button type="submit" className="btn btn-danger w-100">Delete Genre</button>
          <button type="button" onClick={() => navigate('/manage-content')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default DeleteGenre;
