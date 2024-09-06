import React from 'react';
import { Tabs, Tab, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import ExploreIcon from '@mui/icons-material/Explore';
import '../styles/Navbar.css'; // Assume this file is updated for Replit theme

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
            style: { backgroundColor: '#00E676', height: '3px' } // Green tab indicator for a sleek look
          }}
          sx={{
            minHeight: '48px', // Reduce the tab height for a minimalist look
          }}
        >
          <Tab
            label={<h2 style={{ margin: 0, color: "white" , fontFamily:"SUSE"}}>DevComm</h2>}
            disabled
            sx={{ minWidth: 'auto', color: '#00E676' }} // Replit green for branding
          />
          <Tab 
            label="Profile"
            component={Link}
            to="/profile"
            value="/profile"
            sx={{ 
              color: currentPath === '/profile' ? '#00E676' : 'white',
              fontSize: '14px', // Smaller font for a sleeker design
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
            label="Jobs"
            component={Link}
            to="/jobs"
            value="/jobs"
            sx={{ 
              color: currentPath === '/jobs' ? '#00E676' : 'white',
              fontSize: '14px',
            }}
          />
          <Tab 
            label="Orion"
            component={Link}
            to="/orion"
            value="/orion"
            sx={{ 
              color: currentPath === '/orion' ? '#00E676' : 'white',
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
          bgcolor: '#1E1E1E', // Dark background for Replit feel
          justifyContent: 'space-between', // Spread out items
          padding: '8px 0',
        }}
        value={currentPath}
      >
        {/* <BottomNavigationAction
          icon={<HomeIcon />}
          component={Link}
          to="/home"
          value="/home"
          sx={{ 
            color: currentPath === '/home' ? '#00E676' : 'white',
          }} 
        /> */}
        <BottomNavigationAction
          icon={<PersonIcon />}
          component={Link}
          to="/profile"
          value="/profile"
          sx={{ 
            color: currentPath === '/profile' ? '#00E676' : 'white',
          }}
        />
        <BottomNavigationAction
          icon={<TrendingUpIcon />}
          component={Link}
          to="/repos"
          value="/repos"
          sx={{ 
            color: currentPath === '/repos' ? '#00E676' : 'white',
          }}
        />
        <BottomNavigationAction
          icon={<ArticleIcon />}
          component={Link}
          to="/dev"
          value="/dev"
          sx={{ 
            color: currentPath === '/dev' ? '#00E676' : 'white',
          }}
        />
        <BottomNavigationAction
          icon={<WorkIcon />}
          component={Link}
          to="/getJobs"
          value="/getJobs"
          sx={{ 
            color: currentPath === '/getJobs' ? '#00E676' : 'white',
          }}
        />
        <BottomNavigationAction
          icon={<ExploreIcon />}
          component={Link}
          to="/try"
          value="/try"
          sx={{ 
            color: currentPath === '/try' ? '#00E676' : 'white',
          }}
        />
      </BottomNavigation>
    </div>
  );
}

export default Navbar;
