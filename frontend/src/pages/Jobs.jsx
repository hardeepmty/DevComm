import React from 'react'
import PostJobPage from './PostJobPage'
import JobListingsPage from './JobListingsPage'

const Jobs = () => {
  return (
    <div style={{display:"flex"}}>
      <PostJobPage/>
      <JobListingsPage/>
    </div>
  )
}

export default Jobs
