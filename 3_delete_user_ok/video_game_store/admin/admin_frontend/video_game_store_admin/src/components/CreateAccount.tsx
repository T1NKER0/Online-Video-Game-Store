import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Permission {
  role_id: number;
  role_name: string;
}

const CreateAccount: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [accessCredentials, setAccessCredentials] = useState('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermission, setSelectedPermission] = useState('');
  const navigate = useNavigate();

  // Fetch permissions from backend
  useEffect(() => {
    axios.get('http://localhost:5000/permissions')
      .then(response => {
        console.log('Permissions data:', response.data); // Debugging log
        setPermissions(response.data.permissions || []); // Directly set permissions from response
      })
      .catch(error => {
        console.error('Error fetching permissions:', error);
      });
  }, []);
  

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/register', { 
        fullName, 
        signInEmail, 
        accessCredentials,
        role: selectedPermission // Send role ID instead of name
      });
      localStorage.setItem('token', response.data.token);
      navigate('/manage-users'); // Redirect after successful registration
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="container w-50">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <div className="mb-3">
            <input 
              type="text" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="form-control" 
              placeholder="Full Name" 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="email" 
              value={signInEmail} 
              onChange={(e) => setSignInEmail(e.target.value)} 
              className="form-control" 
              placeholder="Email" 
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="password" 
              value={accessCredentials} 
              onChange={(e) => setAccessCredentials(e.target.value)} 
              className="form-control" 
              placeholder="Password" 
              required 
            />
          </div>
          <div className="mb-3">
            <label>Select Permission</label>
            <select 
              className="form-control" 
              value={selectedPermission} 
              onChange={(e) => setSelectedPermission(e.target.value)} 
              required
            >
              <option value="">-- Select Role --</option>
              {permissions.map((perm) => (
                <option key={perm.role_id} value={perm.role_id}>
                  {perm.role_name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">Add User</button>
          <button onClick={() => navigate('/manage-users')} className="btn btn-secondary w-100 mt-2">Back</button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
