import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [github, setGithub] = useState(''); // Added state for GitHub
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/user/register', {
        username,
        email,
        password,
        github, // Include GitHub in the request
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
    <div className="container">
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>GitHub Username:</label>
          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already a user? <button onClick={() => navigate('/login')}>Login</button>
      </p>
    </div>
  );
}

export default Register;
