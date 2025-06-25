import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import HomePage from './components/HomePage';
import ManageUsers from './components/ManageUsers';
import DeleteAccount from './components/DeleteAccount';
import ManageContent from './components/ManageContent';
import ResetPassword from './components/ResetPassword';
import ManageGenres from './components/ManageGenres';
import CreateGenre from './components/CreateGenre';
import DeleteGenre from './components/DeleteGenre';
import DeleteGame from './components/DeleteGame';
import ModifyGenre from './components/ModifyGenre';
import ModifyGame from './components/ModifyGame';
import ManageGames from './components/ManageGames';
import CreateGame from './components/CreateGame';
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

          {/* manage content */}
          <Route path="/manage-content" element={<ManageContent />} />

           {/* manage genres */}
           <Route path="/manage-genres" element={<ManageGenres />} />

           {/* create genre */}
           <Route path="/create-genre" element={<CreateGenre />} />

           {/* remove genre */}
           <Route path="/delete-genre" element={<DeleteGenre />} />

            {/* modify genre */}
            <Route path="/modify-genre" element={<ModifyGenre />} />

            {/* modify game */}
            <Route path="/modify-game" element={<ModifyGame />} />

             {/* remove game */}
           <Route path="/delete-game" element={<DeleteGame />} />

            {/* manage games */}
           <Route path="/manage-games" element={<ManageGames />} />

            {/* create genre */}
            <Route path="/add-game" element={<CreateGame />} />

            {/* remove users */}
            <Route path="/delete-account" element={<DeleteAccount />} />

            {/* reset password */}
            <Route path="/reset-password" element={<ResetPassword />} />

          {/* Login and Register routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
