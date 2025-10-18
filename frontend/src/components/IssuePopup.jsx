import React, { use, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { TrendingUp } from 'lucide-react';
import axios from 'axios';

const IssuePopup = ({issue, setShowIssuePopup}) => {
  const { isSignedIn, getToken, user } = useAuth();
  const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;

  const [votes, setVotes] = useState(issue.votes || 0);
  const [voted, setVoted] = useState(Boolean(issue.voters?.includes(user?.$id)));

  useEffect(() => {
    setVotes(issue.votes || 0);
    setVoted(Boolean(issue.voters?.includes(user?.$id)));
  }, [issue, user]);

  const statusClasses = (() => {
    const s = (issue.status || '').toLowerCase()
    if (s.includes('resolv')) return 'bg-green-100 text-green-800'
    if (s.includes('progress')) return 'bg-amber-100 text-amber-800'
    return 'bg-red-100 text-red-800'
  })()

  const handleVote = async () => {
    if (!isSignedIn) return;
    try {
      const authToken = await getToken();
      const response = await axios.post(`${BASE_API_URL}/api/issues/${issue._id}/vote`, {
        userId: user.$id
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      });
      setVotes(response.data.votes);
      setVoted(prev => !prev);

    } catch (error) {
      console.error('Error voting:', error);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => setShowIssuePopup(false)}
      role="dialog"
      aria-modal="true"
      aria-label={`Issue ${issue.title}`}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl p-5 md:p-6 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        {/* <button
          onClick={() => setShowIssuePopup(false)}
          aria-label="Close"
          className="absolute right-3 top-3 w-8 h-8 rounded-full text-zinc-700 hover:bg-zinc-100 flex items-center justify-center"
        >
          ×
        </button> */}

        {/* Header */}
        <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-3">
          <div>
            <span className="inline-block text-xs bg-amber-300 px-3 py-1 rounded-full text-zinc-700">
              {issue.category}
            </span>
            <h2 className="mt-3 text-lg font-semibold leading-tight text-zinc-900">
              {issue.title}
            </h2>
            <div className="mt-1 text-xs text-zinc-500">
              <span>Issue ID: {issue._id}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 capitalize py-1 rounded-full text-xs font-medium ${statusClasses}`}>
              {issue.status || 'Unknown'}
            </span>
            <span className="text-xs text-zinc-500 capitalize">{issue.city || ''}</span>
          </div>
        </div>

        {/* Image / content */}
        {issue.imageUrl ? (
          <img
            src={issue.imageUrl}
            alt="Issue"
            className="mt-4 w-full max-h-64 object-cover rounded-md border border-zinc-500"
          />
        ) : (
          <div className="mt-4 w-full max-h-40 flex items-center justify-center rounded-md border border-dashed border-zinc-200 text-zinc-400 py-8">
            No image provided
          </div>
        )}

        {/* Message */}
        {issue.userMessage ? (
          <p className="mt-4 text-sm text-zinc-700">{issue.userMessage}</p>
        ) : (
          <p className="mt-4 text-sm text-zinc-500 italic">No description provided.</p>
        )}

        {/* Footer actions */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="font-medium">{votes}</span>
              <span className="text-xs text-zinc-400">votes</span>
            </div>

            {isSignedIn && (
              <button
                onClick={() => {
                  handleVote();
                }}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  voted ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700'
                }`}
                aria-pressed={voted}
              >
                {voted ? 'Voted' : 'Vote'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Share feature coming soon! */}
            {/* <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href)
              }}
              className="text-sm px-3 py-1 rounded-md bg-zinc-100 hover:bg-zinc-200"
            >
              Share
            </button> */}

            <button
              onClick={() => setShowIssuePopup(false)}
              className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssuePopup
