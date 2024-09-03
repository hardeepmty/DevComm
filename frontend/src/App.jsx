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
import PostJobPage from './pages/PostJobPage';
import JobListingsPage from './pages/JobListingsPage';
import Navbar from './components/Navbar';
import CodingChallenge from './pages/CodingChallenge'
import './App.css'
import CodingAssistant from './pages/CodingAssistant';
import CodeEditor from './pages/CodeEditor';

function App() {
  return (
    <Router>
      <div className="App">
      <Navbar />
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
          <Route path='/postJob' element={<PostJobPage/>}/>
          <Route path='/getJobs' element={<JobListingsPage/>}/>
          <Route path='/code' element={<CodingChallenge/>}/>
          <Route path='/codeass' element={<CodingAssistant/>}/>
          <Route path='/codeeditor' element={<CodeEditor/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
