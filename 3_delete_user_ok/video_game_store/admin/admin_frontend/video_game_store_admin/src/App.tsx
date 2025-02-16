import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import HomePage from './components/HomePage';
import ManageUsers from './components/ManageUsers';
import DeleteAccount from './components/DeleteAccount';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* Home page */}
          <Route path="/home-page" element={<HomePage />} />

          {/* manage users */}
          <Route path="/manage-users" element={<ManageUsers />} />

            {/* remove users */}
            <Route path="/delete-account" element={<DeleteAccount />} />

          {/* Login and Register routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
