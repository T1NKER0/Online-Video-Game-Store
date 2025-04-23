import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import GameList from './components/GameList';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './components/LandingPage'; // Import the new MainPage component
import Login from './components/Login'; // Import LoginPage component
//import CreateAccount from './components/CreateAccount'; // Import RegisterPage component
import 'bootstrap/dist/css/bootstrap.min.css';
//import HomePage from './components/HomePage'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Home page route */}
          {//<Route path="/HomePage" element={<HomePage />} /> 
}

          {/* Login and Register routes */}
         // <Route path="/login" element={<Login />} />

          { //<Route path="/create-account" element={<CreateAccount />} />
}

          {/* Other routes */}
          { //<Route path="/games" element={<GameList />} />
}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
