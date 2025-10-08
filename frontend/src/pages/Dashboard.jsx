import React from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div>
      <section>
        <h1 className='text-3xl font-bold'>Dashboard Page</h1>
        some cards here
      </section>
      <section>
        <h2 className='text-2xl font-bold'>Recent Activity</h2>
        <p>No recent activity to display.</p>
      </section>
      <div>
        <Link to="/report" className='bg-yellowOrange text-white px-6 py-3 mt-3 w-fit rounded-full hover:opacity-55'>Report New Issue</Link>
      </div>
    </div>
  )
}

export default Dashboard
