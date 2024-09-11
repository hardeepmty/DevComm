import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/JobListingsPage.css';

const JobListingsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [companyLogos, setCompanyLogos] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        const response = await axios.get('https://devcomm.onrender.com/api/job/getJobs', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        const jobsData = response.data;
        setJobs(jobsData);

        
        jobsData.forEach(job => fetchCompanyLogo(job.company));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchCompanyLogo = async (companyName) => {
      try {
        const response = await axios.get(`https://api.brandfetch.com/v2/brands/${companyName}`, {
          headers: {
            Authorization: `Bearer U/MSgCOoITG70xjl/UwMToRZbl+MgixoeG+q1Tl5rGk=`,
          },
        });
        console.log(response.data)
        const logoUrl = response.data.logos[0]?.url;
        if (logoUrl) {
          setCompanyLogos((prevLogos) => ({
            ...prevLogos,
            [companyName]: logoUrl,
          }));
        }
      } catch (error) {
        console.error(`Error fetching logo for ${companyName}:`, error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="job-listings-container">
      <h1 className="page-title" style={{ color: 'white' }}>Job Listings</h1>
      <div className="jobs-list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3 className="job-company">{job.company}</h3>
                {companyLogos[job.company] && (
                  <img
                    src={companyLogos[job.company]}
                    alt={`${job.company} logo`}
                    className="company-logo"
                  />
                )}
              </div>
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
