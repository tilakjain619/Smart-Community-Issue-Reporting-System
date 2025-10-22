import React, { useEffect, useState } from 'react'
import { getAllIssues, updateIssueStatus, getFilteredIssues, searchIssues } from '../api/Issues'
import IssuePopup from '../components/IssuePopup.jsx'
import { useAuth } from '../contexts/AuthContext';
import { Search, Filter, X } from 'lucide-react';

const ManageIssues = () => {
  const [issues, setIssues] = useState([])
  const [showIssuePopup, setShowIssuePopup] = useState(false);
  const [currentIssue, setCurrentIssue] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    city: '',
    sortBy: 'createdAt',
    order: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  const { user, getToken } = useAuth();

  const fetchIssues = async () => {
    setLoading(true);
    try {
      let data;
      if (searchQuery.trim()) {
        // Use search API if there's a search query
        data = await searchIssues(searchQuery, filters);
      } else if (filters.status || filters.city) {
        // Use filtered API if filters are applied
        data = await getFilteredIssues(filters);
      } else {
        // Use regular API for all issues
        data = await getAllIssues();
      }
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to refetch issues when search or filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchIssues();
    }, 300); // Debounce search to avoid too many API calls

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  useEffect(() => {
    fetchIssues()
  }, [])

  const handleShowIssuePopup = (issue) => {
    setCurrentIssue(issue);
    setShowIssuePopup(true);
  }
  const handleClearFilters = () => {
    setSearchQuery('');
    setFilters({
      status: '',
      city: '',
      sortBy: 'createdAt',
      order: 'desc'
    });
  };

  const handleUpdateIssueStatus = async (issueId, status) => {
    try {
      const token = await getToken();
      await updateIssueStatus(issueId, status, token);
      fetchIssues();
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  }

  return (
    <>
      <div className={`max-w-6xl mx-auto px-4 transition-opacity duration-300 ${showIssuePopup ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'}`}>
        <h1 className='text-2xl text-zinc-800 font-bold mb-4'>Manage Issues</h1>
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search issues by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 outline-none rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            {(searchQuery || filters.status || filters.city) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  placeholder="Filter by city"
                  value={filters.city}
                  onChange={(e) => setFilters({...filters, city: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={`${filters.sortBy}-${filters.order}`}
                  onChange={(e) => {
                    const [sortBy, order] = e.target.value.split('-');
                    setFilters({...filters, sortBy, order});
                  }}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="createdAt-desc">Latest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading issues...</p>
          </div>
        ) : (
          /* Issues Grid */
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {issues.map(issue => (
              <li key={issue._id || issue.id} className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-transform duration-150 transform hover:-translate-y-1 cursor-default'>
                <div className='flex items-start justify-between gap-3'>
                  <div className='flex-1 min-w-0'>
                    <h3
                      onClick={() => handleShowIssuePopup(issue)}
                      className='text-lg font-semibold text-zinc-800 hover:underline cursor-pointer truncate'
                      title={issue.title}
                    >
                      {issue.title}
                    </h3>
                    <p className='text-sm text-zinc-600 mt-1 line-clamp-3 max-h-12 overflow-hidden'>
                      {issue.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className='flex flex-col items-end gap-2'>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      (issue.status || '').toLowerCase() === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                      (issue.status || '').toLowerCase() === 'in progress' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {((issue.status || 'pending').charAt(0).toUpperCase() + (issue.status || 'pending').slice(1))}
                    </span>
                    <button
                      onClick={() => handleShowIssuePopup(issue)}
                      className='text-xs text-zinc-600 hover:text-zinc-800'
                      aria-label={`View details for ${issue.title}`}
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className='mt-4 flex items-center justify-between gap-3'>
                  <div className='flex items-center gap-2'>
                    <label className='text-sm font-medium text-zinc-700'>Update</label>
                    <select
                      aria-label={`Update status for ${issue.title}`}
                      className='text-sm border border-zinc-300 rounded px-2 py-1 bg-white'
                      value={(issue.status || 'pending').toLowerCase()}
                      onChange={(e) => handleUpdateIssueStatus(issue._id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>

                  <div className='text-xs text-zinc-500'>
                    {issue.createdAt ? new Date(issue.createdAt).toLocaleDateString() : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showIssuePopup && <IssuePopup issue={currentIssue} setShowIssuePopup={setShowIssuePopup} />}
    </>
  )

}

export default ManageIssues
