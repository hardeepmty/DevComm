import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/profile/:userId' element={<UserProfile/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
