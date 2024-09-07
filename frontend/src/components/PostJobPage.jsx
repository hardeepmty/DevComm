import React, { useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import '../styles/PostJobPage.css'; 

const PostJobPage = () => {
  const [job, setJob] = useState({
    company: '',
    role: '',
    description: '',
    link: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Please login to post a job!');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/job/newJob', job, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMessage(response.data.message);
      toast.success('Posted job successfully!');
      window.location.href = '/getJobs';
      setJob({ company: '', role: '', description: '', link: '' });
    } catch (error) {
      setMessage('Failed to post job. Please try again.');
      toast.error('Failed to post job. Please try again.');
      console.error('Error posting job:', error);
    }
  };

  return (
    <div className="post-job-container">
      <Toaster />
      {/* <h1 className="page-title">Post a New Job</h1> */}
      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group">
          <label className="form-label">Company:</label>
          <input
            type="text"
            name="company"
            value={job.company}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Role:</label>
          <input
            type="text"
            name="role"
            value={job.role}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Link:</label>
          <input
            type="text"
            name="link"
            value={job.link}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-button">Post Job</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default PostJobPage;
