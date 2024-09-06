import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import PostJobPage from './PostJobPage';
import JobListingsPage from './JobListingsPage';
import useMediaQuery from '@mui/material/useMediaQuery';

const Jobs = () => {
  const isMobile = useMediaQuery('(max-width: 600px)'); // For mobile detection
  const [tabValue, setTabValue] = useState(0); // State for the selected tab

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      {isMobile ? (
        // Mobile View: Use MUI Tabs
        <Box sx={{ width: '100%', backgroundColor: 'black', paddingTop: '10px' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            textColor="inherit" 
            TabIndicatorProps={{ style: { backgroundColor: '#00E676' } }} // Replit green for the active tab indicator
            centered
            variant="fullWidth"
          >
            <Tab label="Post a Job" sx={{ color: 'white' }} />
            <Tab label="Job Listings" sx={{ color: 'white' }} />
          </Tabs>

          {/* Conditionally render content based on the selected tab */}
          {tabValue === 0 && (
            <div style={{ padding: '20px', backgroundColor: 'black' }}>
              <PostJobPage />
            </div>
          )}
          {tabValue === 1 && (
            <div style={{ padding: '20px', backgroundColor: 'black' }}>
              <JobListingsPage />
            </div>
          )}
        </Box>
      ) : (
        // Desktop View: Standard layout with PostJobPage and JobListingsPage
        <div
          style={{
            display: 'flex',
            width: '100%',
            padding: '20px',
            backgroundColor: 'black',
            gap: '20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ flex: 1, minWidth: '200px', backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px' }}>
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px' ,color:"white", fontFamily:"SUSE"}}>Post a Job</h2>
            <PostJobPage />
          </div>
          <div style={{ flex: 2, minWidth: '300px', backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px' }}>
            <h2 style={{ borderBottom: '1px solid #444', paddingBottom: '10px', marginBottom: '20px',color:"white", fontFamily:"SUSE" }}>Job Listings</h2>
            <JobListingsPage />
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
