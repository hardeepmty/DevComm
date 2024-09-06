import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import UserList from './UserList';
import PostList from './PostList';
import JobListingsPage from './JobListingsPage';
import useMediaQuery from '@mui/material/useMediaQuery';

const Try = () => {
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
            <Tab label="Posts" sx={{ color: 'white' }} />
            <Tab label="Users" sx={{ color: 'white' }} />
          </Tabs>

          {/* Conditionally render content based on the selected tab */}
          {tabValue === 0 && (
            <div style={{ padding: '0px', backgroundColor: 'black' }}>
              <PostList />
            </div>
          )}
          {tabValue === 1 && (
            <div style={{ padding: '20px', backgroundColor: 'black' }}>
              <UserList />
            </div>
          )}
        </Box>
      ) : (
        // Desktop View: Standard layout with JobListingsPage, PostList, and UserList
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: 'auto',
            padding: '20px',
            backgroundColor: 'black',
            gap: '0px',
            boxSizing: 'border-box',
            paddingTop: '0px',
          }}
        >
          <div style={{ flex: 1, minWidth: '200px' }}>
            <JobListingsPage />
          </div>
          <div style={{ flex: 2, minWidth: '300px' }}>
            <PostList />
          </div>
          <div style={{ flex: 1, minWidth: '200px', flexDirection: 'column' }}>
            <UserList />
          </div>
        </div>
      )}
    </div>
  );
};

export default Try;
