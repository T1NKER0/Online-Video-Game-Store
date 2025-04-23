import React, { useState } from 'react'; // lets react know that the "state" will change during runtime
import axios from 'axios'; // http requests - node.js
import { useNavigate } from 'react-router-dom'; // allows navigation from one component to another
import 'bootstrap/dist/css/bootstrap.min.css'; // style

// [param, setter]
// by using useState, we let React know that the value of param will be modified during runtime by setters
const CreateAccount = () => {
  const [fullName, setFullName] = useState('');
  const [psnID, setPsnID] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [accessCredentials, setAccessCredentials] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const navigate = useNavigate();

  // submit info to node.js
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // prevents the default browser behavior of reloading the page when a form is submitted.
    try {
      // Ensure dob is in the correct format (YYYY-MM-DD) before sending
      const formattedDob = new Date(dateOfBirth).toISOString().split('T')[0];

      // post request to node.js
      const response = await axios.post('http://localhost:5000/api/register', { fullName, psnID, signInEmail, accessCredentials, dateOfBirth: formattedDob });
      localStorage.setItem('token', response.data.token);
      navigate('/'); // Redirect to the home page

    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle navigating back to the main page
  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="d-flex justify-content-space-between" style={{ minHeight: '100vh' }}>
      {/* Left section with form */}
      <div className="container d-flex flex-column justify-content-center align-items-start w-50">
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={handleSubmit} className="form-group w-75">
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
              type="text"
              value={psnID}
              onChange={(e) => setPsnID(e.target.value)}
              className="form-control"
              placeholder="PSN ID"
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
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="form-control"
              required
            />
          </div>
          {/* Buttons */}
          <div className="d-flex flex-column justify-content-center">
            <button type="submit" className="btn btn-primary btn-block mt-3 w-100">Register</button>
            <button onClick={handleBack} className="btn btn-secondary mt-3 w-100">Back to Main Page</button>
          </div>
        </form>
      </div>

      {/* Right section with title and images */}
      <div className="w-50 d-flex flex-column justify-content-center align-items-center">
        {/* Title */}
        <h1 style={{ marginBottom: '20px' }}>Play Like Never Before</h1>

        {/* Images */}
        <div className="d-flex w-100" style={{ paddingRight: '1px' }}>
          <img
            src="https://image.api.playstation.com/vulcan/ap/rnd/202306/1219/60eca3ac155247e21850c7d075d01ebf0f3f5dbf19ccd2a1.jpg"
            alt="Image 1"
            style={{
              width: '33.33%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
          <img
            src="https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/3UwtyLer3xjXOX2qlhunnvnJ.png"
            alt="Image 2"
            style={{
              width: '33.33%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
          <img
            src="https://image.api.playstation.com/vulcan/ap/rnd/202210/0712/cWZlv5HCWi4sGKuwVRO4c8Xg.png"
            alt="Image 3"
            style={{
              width: '33.33%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
