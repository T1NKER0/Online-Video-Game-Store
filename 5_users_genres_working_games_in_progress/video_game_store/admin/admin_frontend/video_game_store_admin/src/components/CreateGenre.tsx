import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateGenre: React.FC = () => {
  const [gameType, setGameType] = useState('');
  const navigate = useNavigate();

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/type-of-game', { typeName: gameType });

      navigate('/manage-content'); // Redirect after successful submission
    } catch (err) {
      console.error('Error creating genre:', err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Create Genre</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <div className="mb-3">
            <input 
              type="text" 
              value={gameType} 
              onChange={(e) => setGameType(e.target.value)} 
              className="form-control" 
              placeholder="Genre Name" 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Add Genre</button>
          <button type="button" onClick={() => navigate('/manage-content')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default CreateGenre;
