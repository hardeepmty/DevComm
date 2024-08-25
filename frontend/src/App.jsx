import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import TrendingRepositories from './pages/TrendingRepositories';
import PopularArticles from './pages/PopularArticles';
import Try from './pages/Try';
import Chat from './pages/Chat';
import ImageUpload from './pages/dummy';

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
          <Route path='/repos' element={<TrendingRepositories/>}/>
          <Route path='/dev' element={<PopularArticles/>}/>
          <Route path='/try' element={<Try/>}/>
          <Route path="/chat/:userId" element={<Chat/>} />
          <Route path='/img-upd' element={<ImageUpload/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
