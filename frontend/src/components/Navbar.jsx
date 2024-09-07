import React from 'react';
import { Tabs, Tab, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import '../styles/Navbar.css';
function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div>
      {/* Tabs for larger screens */}
      <Box sx={{
        display: { xs: 'none', sm: 'flex' }, 
        justifyContent: 'space-around', // Spread out tabs like in Replit
        alignItems: 'center',
        bgcolor: '#1E1E1E', // Replit dark theme background
        color: 'white', // White text
        padding: '10px 0',
      }}>
        <Tabs
          value={currentPath}
          textColor="inherit"
          TabIndicatorProps={{
            style: { backgroundColor: '#00E676', height: '3px' }
          }}
          sx={{
            minHeight: '48px',
          }}
        >
          <Tab
            label={<h2 style={{ margin: 0, color: "white" , fontFamily:"SUSE"}}>DevComm</h2>}
            disabled
            sx={{ minWidth: 'auto', color: '#00E676' }} 
          />
          <Tab 
            label="Profile"
            component={Link}
            to="/profile"
            value="/profile"
            sx={{ 
              color: currentPath === '/profile' ? '#00E676' : 'white',
              fontSize: '14px', 
            }}
          />
            <Tab 
            label="Home"
            component={Link}
            to="/try"
            value="/try"
            sx={{ 
              color: currentPath === '/try' ? '#00E676' : 'white',
              fontSize: '14px',
            }}
          />


          <Tab 
            label={<span className="glitch">Orion</span>} 
            component={Link}
            to="/orion"
            value="/orion"
            sx={{ 
              color: currentPath === '/orion' ? '#00E676' : 'white',
              fontSize: '14px',
              fontFamily: 'SUSE', 
            }}
          />


          <Tab 
            label="Trending"
            component={Link}
            to="/comb"
            value="/comb"
            sx={{ 
              color: currentPath === '/comb' ? '#00E676' : 'white',
              fontSize: '14px',
            }}
          />
          
          <Tab 
            label="Jobs"
            component={Link}
            to="/jobs"
            value="/jobs"
            sx={{ 
              color: currentPath === '/jobs' ? '#00E676' : 'white',
              fontSize: '14px',
            }}
          />

        </Tabs>
      </Box>

      {/* Bottom Navigation for mobile screens */}
      <BottomNavigation
        sx={{ 
          display: { xs: 'flex', sm: 'none' },
          width: '100%', 
          position: 'fixed', 
          bottom: 0, 
          bgcolor: '#1E1E1E', 
          justifyContent: 'space-between', 
          padding: '8px 0',
          zIndex: "9000"
        }}
        value={currentPath}
        showLabels
      >
        <BottomNavigationAction
          icon={<HomeIcon />}
          component={Link}
          to="/try"
          value="/try"
          sx={{ 
            color: currentPath === '/try' ? '#00E676' : 'white',
            '&.Mui-selected': { color: '#00E676' } 
          }}
        />
        <BottomNavigationAction
          icon={<PersonIcon />}
          component={Link}
          to="/profile"
          value="/profile"
          sx={{ 
            color: currentPath === '/profile' ? '#00E676' : 'white',
            '&.Mui-selected': { color: '#00E676' }
          }}
        />
        <BottomNavigationAction
          icon={<AutoAwesomeIcon />}
          component={Link}
          to="/orion"
          value="/orion"
          sx={{ 
            color: currentPath === '/orion' ? '#00E676' : 'white',
            '&.Mui-selected': { color: '#00E676' } 
          }}
        />
        <BottomNavigationAction
          icon={<WhatshotIcon />}
          component={Link}
          to="/comb"
          value="/comb"
          sx={{ 
            color: currentPath === '/comb' ? '#00E676' : 'white',
            '&.Mui-selected': { color: '#00E676' } 
          }}
        />
        <BottomNavigationAction
          icon={<WorkIcon />}
          component={Link}
          to="/jobs"
          value="/jobs"
          sx={{ 
            color: currentPath === '/jobs' ? '#00E676' : 'white',
            '&.Mui-selected': { color: '#00E676' } 
          }}
        />
      </BottomNavigation>
    </div>
  );
}

export default Navbar;
