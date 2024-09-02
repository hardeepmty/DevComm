import React from 'react';
import UserList from './UserList';
import PostList from './PostList';
import JobListingsPage from './JobListingsPage';

const Try = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <UserList />
      </div>
      <div style={{ flex: 2, minWidth: '300px' }}>
        <PostList />
      </div>
      <div style={{ flex: 1, minWidth: '200px',flexDirection:"column" }}>
        <UserList />
        <JobListingsPage />
      </div>
    </div>
  );
};

export default Try;
