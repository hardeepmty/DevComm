import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobListingsPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        const response = await axios.get('http://localhost:5000/api/job/getJobs',{
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <h1>Job Listings</h1>
      <div>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id}>
              <h3>{job.company}</h3>
              <p><strong>Role:</strong> {job.role}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Link:</strong> <a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a></p>
            </div>
          ))
        ) : (
          <p>No jobs available</p>
        )}
      </div>
    </div>
  );
};

export default JobListingsPage;
