import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from './components/Game';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage'; // Import the new MainPage component
import Login from './components/Login'; // Import LoginPage component
import CreateAccount from './components/CreateAccount'; // Import RegisterPage component
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './components/HomePage'
import SearchResults from './components/SearchResults';
import Wishlist from './components/Wishlist';
import GenreGames from './components/GenreGames';
import PurchasedGames from './components/PurchasedGames';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Home page route */}
          <Route path="/HomePage" element={<HomePage />} />

          {/* Wishlist route */}
          <Route path="/Wishlist" element={<Wishlist />} />

          {/* Purchased Games */}
          <Route path="/Purchased" element={<PurchasedGames />} />

          {/* Login and Register routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />

          {/* Other routes */}
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/game" element={<Game />} />
          <Route path="/genre-games" element={<GenreGames />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
