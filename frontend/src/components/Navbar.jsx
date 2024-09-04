import React from 'react';
import { Tabs, Tab, Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArticleIcon from '@mui/icons-material/Article';
import WorkIcon from '@mui/icons-material/Work';
import ExploreIcon from '@mui/icons-material/Explore';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div>
      {/* Tabs for larger screens */}
      <Box sx={{
        display: { xs: 'none', sm: 'flex' }, // Hide on mobile
        justifyContent: 'center',
        alignItems: 'center',
        borderBottom: 1,
        bgcolor: 'gray',
        borderColor: 'yellow',
        borderWidth: '3px',
      }}>
        <Tabs 
          value={currentPath}
          textColor="inherit"
          TabIndicatorProps={{
            style: { backgroundColor: 'blue' } // Change the indicator color to green
          }}
        >
          <Tab
            label={<h2 style={{ fontFamily: 'SUSE', margin: 0, color: "white" }}>DevComm</h2>}
            disabled
            style={{ minWidth: 'auto' }}
          />
          <Tab 
            label="Profile" 
            component={Link} 
            to="/profile" 
            value="/profile"
            sx={{ 
              color: 'black', // Default color
              '&.Mui-selected': { 
                color: 'orange', // Color when selected
              } 
            }}
          />
          <Tab 
            label="Trending" 
            component={Link} 
            to="/comb" 
            value="/comb" 
            sx={{ 
              color: 'black',
              '&.Mui-selected': { 
                color: 'green',
              } 
            }}
          />
          <Tab 
            label="Home" 
            component={Link} 
            to="/try" 
            value="/try" 
            sx={{ 
              color: 'black',
              '&.Mui-selected': { 
                color: 'green',
              } 
            }}
          />
          <Tab 
            label="Jobs" 
            component={Link} 
            to="/jobs" 
            value="/jobs" 
            sx={{ 
              color: 'black',
              '&.Mui-selected': { 
                color: 'green',
              } 
            }}
          />
          <Tab 
            label="Orion" 
            component={Link} 
            to="/orion" 
            value="/orion"
            sx={{ 
              color: 'black',
              '&.Mui-selected': { 
                color: 'green',
              } 
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
          bgcolor: 'gray',
          justifyContent: 'space-around', // Distribute items evenly
        }}
        value={currentPath}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          component={Link}
          to="/home"
          value="/home"
          sx={{ 
            minWidth: 0, 
            maxWidth: '100%', 
            color: currentPath === '/home' ? 'green' : 'inherit', // Change color when selected
          }} 
        />
        <BottomNavigationAction
          label="Profile"
          icon={<PersonIcon />}
          component={Link}
          to="/profile"
          value="/profile"
          sx={{ 
            minWidth: 0, 
            maxWidth: '100%', 
            color: currentPath === '/profile' ? 'green' : 'inherit',
          }}
        />
        <BottomNavigationAction
          label="Repos"
          icon={<TrendingUpIcon />}
          component={Link}
          to="/repos"
          value="/repos"
          sx={{ 
            minWidth: 0, 
            maxWidth: '100%', 
            color: currentPath === '/repos' ? 'green' : 'inherit',
          }}
        />
        <BottomNavigationAction
          label="Articles"
          icon={<ArticleIcon />}
          component={Link}
          to="/dev"
          value="/dev"
          sx={{ 
            minWidth: 0, 
            maxWidth: '100%', 
            color: currentPath === '/dev' ? 'green' : 'inherit',
          }}
        />
        <BottomNavigationAction
          label="Jobs"
          icon={<WorkIcon />}
          component={Link}
          to="/getJobs"
          value="/getJobs"
          sx={{ 
            minWidth: 0, 
            maxWidth: '100%', 
            color: currentPath === '/getJobs' ? 'green' : 'inherit',
          }}
        />
        <BottomNavigationAction
          label="Explore"
          icon={<ExploreIcon />}
          component={Link}
          to="/try"
          value="/try"
          sx={{ 
            minWidth: 0, 
            maxWidth: '100%', 
            color: currentPath === '/try' ? 'green' : 'inherit',
          }}
        />
      </BottomNavigation>
    </div>
  );
}

export default Navbar;
