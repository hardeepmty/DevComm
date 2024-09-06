import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import '../styles/Orion.css'; // Assuming this CSS file contains any additional styles you might need

const Orion = () => {
  const isMobile = useMediaQuery('(max-width: 600px)'); // Mobile detection
  const [tabValue, setTabValue] = useState(0); // State for selected tab

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      {isMobile ? (
        // Mobile View: Use MUI Tabs
        <Box sx={{ width: '100%', backgroundColor: '#1f1f1f', paddingTop: '10px' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            textColor="inherit" 
            TabIndicatorProps={{ style: { backgroundColor: '#00E676' } }} // Replit green for the active tab indicator
            centered
            variant="fullWidth"
            sx={{ borderBottom: '1px solid #444', backgroundColor: '#1f1f1f' }} // Tab styles
          >
            <Tab label="Code Editor" sx={{ color: 'white', fontWeight: 'bold' }} />
            <Tab label="Compiler" sx={{ color: 'white', fontWeight: 'bold' }} />
            <Tab label="Coding Assistant" sx={{ color: 'white', fontWeight: 'bold' }} />
          </Tabs>

          {/* Conditionally render content based on selected tab */}
          {tabValue === 0 && (
            <div className="link-container">
              <Link to="/codeeditor">Go to Code Editor</Link>
            </div>
          )}
          {tabValue === 1 && (
            <div className="link-container">
              <Link to="/compiler">Go to Compiler</Link>
            </div>
          )}
          {tabValue === 2 && (
            <div className="link-container">
              <Link to="/codeass">Go to Coding Assistant</Link>
            </div>
          )}
        </Box>
      ) : (
        // Desktop View: Standard layout with three links
        <div className="container">
          <div className="link-container">
            <Link to="/codeeditor">Go to Code Editor</Link>
          </div>
          <div className="link-container">
            <Link to="/compiler">Go to Compiler</Link>
          </div>
          <div className="link-container">
            <Link to="/codeass">Go to Coding Assistant</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orion;
