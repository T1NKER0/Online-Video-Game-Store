import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  admin_id: number;
  email: string;
}

const DeleteAccount: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const navigate = useNavigate();

  // Fetch users from backend
  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        console.log('User data:', response.data);
        setUsers(response.data.users || []);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  // Handle user deletion
  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Please select a user to delete.');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/delete-account/${selectedUser}`);
      alert('User deleted successfully.');
      
      // Update state to remove deleted user
      setUsers(users.filter(user => user.admin_id !== parseInt(selectedUser)));
      setSelectedUser(''); // Reset selection
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user. Please try again.');
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Delete User</h2>
        <form onSubmit={handleDelete} className="form-group">
          <div className="mb-3">
            <label>Select User</label>
            <select 
              className="form-control" 
              value={selectedUser} 
              onChange={(e) => setSelectedUser(e.target.value)} 
              required
            >
              <option value="">-- Select User --</option>
              {users.map((user) => (
                <option key={user.admin_id} value={user.admin_id}>
                  {user.email}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-danger w-100">Delete User</button>
          <button onClick={() => navigate('/manage-users')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccount;
