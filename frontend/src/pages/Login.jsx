import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
import '../styles/Login.css'; 
import Dclogo from '/images/DClogo.jpg'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/user/login', { email, password }, { withCredentials: true });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.user._id);
        // window.location.href = '/profile'; 
        navigate('/profile') ;
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login');
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={Dclogo} alt="DC Logo" className="login-image" />
        <div className="login-text">
          <h1>Build software, better</h1>
          <ul>
            <li>Build, test, and deploy directly from the browser</li>
            <li>Boost productivity with powerful tools</li>
            <li>Collaborate in real-time with your team</li>
            <li>Join a community of developers</li>
          </ul>
        </div>
      </div>

      <div className="login-right">
        <h1>Login to your account</h1>
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <br />
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
