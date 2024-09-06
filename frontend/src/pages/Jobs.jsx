import React from 'react';
import PostJobPage from './PostJobPage';
import JobListingsPage from './JobListingsPage';

const Jobs = () => {
  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px", backgroundColor: "black", color: "#e6e6e6",fontFamily:"SUSE" }}>
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#2d2d2d", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius: "10px" }}>
        <h2 style={{ borderBottom: "1px solid #444", paddingBottom: "10px", marginBottom: "20px" }}>Post a Job</h2>
        <PostJobPage />
      </div>
      <div style={{ flex: 2, padding: "20px", backgroundColor: "#2d2d2d", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", borderRadius: "10px" }}>
        <h2 style={{ borderBottom: "1px solid #444", paddingBottom: "10px", marginBottom: "20px" }}>Job Listings</h2>
        <JobListingsPage />
      </div>
    </div>
  );
};

export default Jobs;
