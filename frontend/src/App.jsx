import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import TrendingRepositories from './components/TrendingRepositories';
import PopularArticles from './components/PopularArticles';
import Try from './pages/Try';
import Chat from './pages/Chat';
import PostJobPage from './components/PostJobPage';
import JobListingsPage from './components/JobListingsPage';
import Navbar from './components/Navbar';
import CodingChallenge from './components/CodingChallenge';
import './App.css';
import CodingAssistant from './pages/CodingAssistant';
import CodeEditor from './pages/CodeEditor';
import Compiler from './pages/Compiler';
import Orion from './pages/Orion';
import CombinedContent from './pages/CombinedContent';
import Jobs from './pages/Jobs';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        {isLoggedIn && <Navbar />}
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/profile/:userId" element={<UserProfile />} />
          {/* <Route path="/repos" element={<TrendingRepositories />} /> */}
          {/* <Route path="/dev" element={<PopularArticles />} /> */}
          <Route path="/try" element={<Try />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/postJob" element={<PostJobPage />} />
          <Route path="/getJobs" element={<JobListingsPage />} />
          {/* <Route path="/code" element={<CodingChallenge />} /> */}
          <Route path="/codeass" element={<CodingAssistant />} />
          <Route path="/codeeditor" element={<CodeEditor />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/orion" element={<Orion />} />
          <Route path="/comb" element={<CombinedContent />} />
          <Route path="/jobs" element={<Jobs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
