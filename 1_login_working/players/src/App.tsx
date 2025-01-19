import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GameList from './components/GameList';
import { AuthProvider } from './context/AuthContext';
import MainPage from './components/MainPage'; // Import the new MainPage component
import Login from './components/Login'; // Import LoginPage component
import CreateAccount from './components/CreateAccount'; // Import RegisterPage component
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Main page route */}
          <Route path="/" element={<MainPage />} />

          {/* Login and Register routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          {/* Other routes */}
          <Route path="/games" element={<GameList />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
