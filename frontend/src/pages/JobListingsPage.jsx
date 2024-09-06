import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/JobListingsPage.css'; // Import CSS file for styling

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
        const response = await axios.get('http://localhost:5000/api/job/getJobs', {
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
    <div className="job-listings-container">
      <h1 className="page-title">Job Listings</h1>
      <div className="jobs-list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <h3 className="job-company">{job.company}</h3>
              <p className="job-role"><strong>Role:</strong> {job.role}</p>
              <p className="job-description"><strong>Description:</strong> {job.description}</p>
              <p className="job-link">
                <strong>Link: </strong> 
                <a href={job.link} target="_blank" rel="noopener noreferrer" className="job-link-url">
                  {job.link}
                </a>
              </p>
            </div>
          ))
        ) : (
          <p className="no-jobs">No jobs available</p>
        )}
      </div>
    </div>
  );
};

export default JobListingsPage;
