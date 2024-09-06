import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Register.css'; // Import the new CSS file
import logo from '../images/DCLogo.jpg'; // Replace with actual logo image path

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [github, setGithub] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', {
        username,
        email,
        password,
        github,
      });

      if (response.data.success) {
        alert('Registration successful! You can now log in.');
        navigate('/login');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to register.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-left">
        <img src={logo} alt="Register Logo" className="register-image" />
        <div className="register-text">
          <h1>Join Us Today</h1>
          <ul>
            <li>Access the best developer tools</li>
            <li>Collaborate with a thriving community</li>
            <li>Enhance your skills with real projects</li>
            <li>Get connected with GitHub and more</li>
          </ul>
        </div>
      </div>

      <div className="register-right">
        <h2>Register</h2>
        {error && <p className="register-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label>GitHub Username:</label>
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
          <button type="submit" className="register-button">Register</button>
        </form>
        <p className="register-login">
          Already a user? <button onClick={() => navigate('/login')}>Login</button>
        </p>
      </div>
    </div>
  );
}

export default Register;
