import React from 'react'

const IssuePopup = ({issue, setShowIssuePopup}) => {
  return (
    <div className='fixed top-1/2 border border-zinc-300 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl px-7 py-5 rounded-xl z-50 w-11/12 max-w-md'>
        <div onClick={() => setShowIssuePopup(false)} className='cursor-pointer bg-zinc-200 w-fit px-3 rounded-lg float-right py-0.5'>Close</div>
        <span className='block text-xs text-zinc-600'>Issue ID: {issue._id}</span>
        <span className='block text-xs bg-amber-300 px-4 py-0.5 rounded-full w-fit mt-2 text-zinc-600'>{issue.category}</span>
      <h2 className='font-bold text-lg mt-2'>{issue.title}</h2>
      {
        issue.userMessage && <p className=''>Message: {issue.userMessage}</p>
      }
      <img src={issue.imageUrl} alt="Issue" className="w-full h-auto my-2 rounded"/>
      <span>Status: {issue.status}</span>
    </div>
  )
}

export default IssuePopup
