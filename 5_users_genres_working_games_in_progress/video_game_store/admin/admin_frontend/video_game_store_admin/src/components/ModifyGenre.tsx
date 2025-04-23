import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Genre {
  genre_id: number;
  genre_name: string;
}

const ModifyGenre: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreId, setSelectedGenreId] = useState('');
  const [newGenreName, setNewGenreName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/gameTypes')
      .then(response => {
        setGenres(response.data.genres || []);
      })
      .catch(error => {
        console.error('Error fetching genres:', error);
      });
  }, []);

  const handleModifyGenre = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGenreId || !newGenreName.trim()) {
      alert('Please select a genre and enter a new name.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/update-genre/${selectedGenreId}`, {
        genreName: newGenreName
      });

      alert('Genre name updated successfully.');
      setGenres(genres.map(g =>
        g.genre_id === parseInt(selectedGenreId) ? { ...g, type_name: newGenreName } : g
      ));
      setSelectedGenreId('');
      setNewGenreName('');
    } catch (error) {
      console.error('Error updating genre:', error);
      alert('Failed to update genre. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Modify Genre</h2>
        <form onSubmit={handleModifyGenre} className="form-group">
          <div className="mb-3">
            <label>Select Genre</label>
            <select 
              className="form-control" 
              value={selectedGenreId} 
              onChange={(e) => setSelectedGenreId(e.target.value)} 
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
              type="text"
              className="form-control"
              placeholder="New Genre Name"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Update Genre</button>
          <button type="button" onClick={() => navigate('/manage-content')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default ModifyGenre;
