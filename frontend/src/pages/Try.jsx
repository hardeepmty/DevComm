import React from 'react';
import UserList from './UserList';
import PostList from './PostList';
import JobListingsPage from './JobListingsPage';

const Try = () => {
  return (
    <div style={{ display: 'flex', width: '100%', height: 'auto', padding: '20px', backgroundColor: 'black', gap: '0px', boxSizing: 'border-box', paddingTop:"0px" }}>
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
  );
};

export default Try;
