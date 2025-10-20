import React from 'react'

const Stats = ({ issues }) => {
  return (
    <section className='mt-4'>
        <h1 className="text-2xl font-bold mb-6 text-zinc-800">Issue Summary</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg px-6 py-6 rounded-xl flex flex-col">
            <h2 className="text-base font-semibold text-zinc-700 mb-2">Total Reports</h2>
            <span className="text-4xl font-extrabold text-zinc-900">{issues.length}</span>
          </div>
          <div className="bg-gradient-to-br from-green-300 to-green-400 shadow-lg px-6 py-6 rounded-xl flex flex-col">
            <h2 className="text-base font-semibold text-zinc-700 mb-2">Resolved</h2>
            <span className="text-4xl font-extrabold text-zinc-900">{issues.filter(issue => issue.status === 'resolved').length}</span>
          </div>
          <div className="bg-gradient-to-br from-red-300 to-red-400 shadow-lg px-6 py-6 rounded-xl flex flex-col">
            <h2 className="text-base font-semibold text-zinc-700 mb-2">Pending</h2>
            <span className="text-4xl font-extrabold text-zinc-900">{issues.filter(issue => issue.status === 'pending').length}</span>
          </div>
          <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 shadow-lg px-6 py-6 rounded-xl flex flex-col">
            <h2 className="text-base font-semibold text-zinc-700 mb-2">In Progress</h2>
            <span className="text-4xl font-extrabold text-zinc-900">{issues.filter(issue => issue.status === 'in progress').length}</span>
          </div>
        </div>
      </section>
  )
}

export default Stats
