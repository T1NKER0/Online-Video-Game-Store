import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <div className="d-flex flex-column justify-content-center align-items-center w-50">
        <h1 className="display-4 mb-4">Playstation Store</h1>
        <p className="lead mb-5">View, purchase, or add games to your wishlist!</p>
        <div>
          <Link to="/login" style={{ marginRight: '20px' }}>
            <button className="btn btn-primary btn-lg">Login</button>
          </Link>
          <Link to="/create-account">
            <button className="btn btn-secondary btn-lg">Create Account</button>
          </Link>
        </div>
      </div>

      <div className="w-50">
        <img 
          src="https://gmedia.playstation.com/is/image/SIEPDC/ps-store-listing-thumb-01-en-05nov20?$facebook$"  // Replace with your image URL
          alt="Playstation Store"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    </div>
  );
};

export default MainPage;
