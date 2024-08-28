import React, { useState } from 'react';
import axios from 'axios';

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
        window.location.href = '/login';
        return;
      }

    try {
      const response = await axios.post('http://localhost:5000/api/job/newJob', job,{
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setMessage(response.data.message);
      alert("Posted job successfully") ;
      window.location.href = '/getJobs';
      setJob({ company: '', role: '', description: '', link: '' });

    } catch (error) {
      setMessage('Failed to post job. Please try again.');
      console.error('Error posting job:', error);
    }
  };

  return (
    <div>
      <h1>Post a New Job</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company:</label>
          <input
            type="text"
            name="company"
            value={job.company}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <input
            type="text"
            name="role"
            value={job.role}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={job.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Link:</label>
          <input
            type="text"
            name="link"
            value={job.link}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Post Job</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default PostJobPage;
