import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface User {
  admin_id: number;
  email: string;
}

const ResetPassword: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      alert('Please select a user.');
      return;
    }

    if (!newPassword || !confirmPassword) {
      alert('Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/reset-password/${selectedUser}`, {
        newPassword
      });

      alert('Password reset successfully.');
      setNewPassword('');
      setConfirmPassword('');
      setSelectedUser('');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Reset User Password</h2>
        <form onSubmit={handleResetPassword} className="form-group">
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
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-warning w-100">Reset Password</button>
          <button onClick={() => navigate('/manage-users')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
