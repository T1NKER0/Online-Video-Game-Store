import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const MainPage = () => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Left section for text and buttons */}
      <div className="d-flex flex-column justify-content-center align-items-center w-50 text-center">
        <h1 className="display-4 mb-4">PSN Admin Dashboard</h1>
        <p className="lead mb-5">Manage Playstation Store Content</p>
        <div>
          <Link to="/login" style={{ marginRight: '20px' }}>
            <button className="btn btn-primary btn-lg">Login</button>
          </Link>
        </div>
      </div>

      {/* Right section for image */}
      <div className="w-50">
        <img 
          src="https://assetsio.gnwcdn.com/psnlogo2.jpg?width=1920&height=1920&fit=bounds&quality=80&format=jpg&auto=webp"  // Correct image URL
          alt="Playstation Store"
          className="img-fluid"  // Bootstrap class to make image responsive
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );
};

export default MainPage;
