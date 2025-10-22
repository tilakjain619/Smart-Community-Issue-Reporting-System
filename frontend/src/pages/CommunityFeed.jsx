import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Loader from '../components/extras/Loader';
import MapUI from '../components/MapUI';
import IssuePopup from '../components/IssuePopup';
import { Search, Filter, MapPin, Calendar, TrendingUp, X, ChevronDown } from 'lucide-react';

const CommunityFeed = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
    const [showIssuePopup, setShowIssuePopup] = useState(false);
    const [currentIssue, setCurrentIssue] = useState(null);
    
    // Filter and search state
    const [searchInput, setSearchInput] = useState(''); // For immediate UI updates
    const [searchQuery, setSearchQuery] = useState(''); // For actual API calls (debounced)
    const [filters, setFilters] = useState({
        status: '',
        city: '',
        state: '',
        sortBy: 'createdAt',
        order: 'desc',
        page: 1,
        limit: 12
    });
    const [showFilters, setShowFilters] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
        count: 0
    });
    
    // Debounce timer ref
    const debounceTimer = useRef(null);
    const [isSearching, setIsSearching] = useState(false);
    
    // Available filter options
    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'open', label: 'Open' },
        { value: 'in progress', label: 'In Progress' },
        { value: 'pending', label: 'Pending' },
        { value: 'closed', label: 'Closed' },
        { value: 'resolved', label: 'Resolved' }
    ];
    
    const sortOptions = [
        { value: 'createdAt', label: 'Date Created' },
        { value: 'votes', label: 'Most Voted' },
        { value: 'title', label: 'Title' }
    ];
    
    const orderOptions = [
        { value: 'desc', label: 'Newest First' },
        { value: 'asc', label: 'Oldest First' }
    ];

    const handleShowIssuePopup = (issue) => {
        setCurrentIssue(issue);
        setShowIssuePopup(true);
    }
    
    const fetchIssues = useCallback(async () => {
        try {
            setLoading(true);
            
            // Build query parameters
            const queryParams = new URLSearchParams();
            
            // Add filters to query
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    queryParams.append(key, value);
                }
            });
            
            let endpoint = `${BASE_API_URL}/api/issues`;
            
            // Use search endpoint if there's a search query
            if (searchQuery.trim()) {
                endpoint = `${BASE_API_URL}/api/issues/search`;
                queryParams.append('query', searchQuery.trim());
            }
            
            // Add query parameters to URL
            const url = `${endpoint}?${queryParams.toString()}`;
            console.log('Fetching issues with URL:', url);
            
            const response = await axios.get(url);
            
            // Handle different response structures for search vs regular fetch
            if (searchQuery.trim()) {
                // Search endpoint returns array directly
                setIssues(response.data);
                setPagination({
                    total: response.data.length,
                    page: 1,
                    totalPages: 1,
                    count: response.data.length
                });
            } else {
                // Regular issues endpoint returns structured response
                setIssues(response.data.issues);
                setPagination({
                    total: response.data.total,
                    page: response.data.page,
                    totalPages: response.data.totalPages,
                    count: response.data.count
                });
            }
        } catch (error) {
            console.error("Error fetching issues:", error);
            setIssues([]);
        } finally {
            setLoading(false);
        }
    }, [BASE_API_URL, filters, searchQuery]);
    
    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page when filters change
        }));
    };
    
    // Handle search input change (immediate UI update)
    const handleSearchInputChange = (query) => {
        setSearchInput(query);
        
        // Clear existing timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        // Show searching indicator if there's a query and it's different from current search
        if (query.trim() && query.trim() !== searchQuery) {
            setIsSearching(true);
        } else if (!query.trim() && searchQuery) {
            // If clearing search, show indicator briefly
            setIsSearching(true);
        }
        
        // Set new timer for debounced search
        debounceTimer.current = setTimeout(() => {
            setSearchQuery(query);
            setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page when searching
            setIsSearching(false); // Hide searching indicator
        }, 500); // 500ms delay
    };
    
    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);
    
    // Clear all filters and search
    const clearFilters = () => {
        // Clear debounce timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        
        setSearchInput('');
        setSearchQuery('');
        setIsSearching(false);
        setFilters({
            status: '',
            city: '',
            state: '',
            sortBy: 'createdAt',
            order: 'desc',
            page: 1,
            limit: 12
        });
    };
    
    // Handle pagination
    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    useEffect(() => {
        fetchIssues();
    }, [fetchIssues])
    return (
        <div className="relative">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <Loader />
                </div>
            ) : (
                <div className={`max-w-6xl mx-auto p-4 transition-opacity duration-300 ${showIssuePopup ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'}`}>
                    
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-zinc-800 mb-2">Community Feed</h1>
                        <p className="text-zinc-600">Explore and track issues reported by your community</p>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            {/* Search Input */}
                            <div className="relative flex-1 w-full sm:w-auto">
                                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isSearching ? 'text-orange-500 animate-pulse' : 'text-zinc-400'}`} />
                                <input
                                    type="text"
                                    placeholder="Search issues by title, category, or location..."
                                    value={searchInput}
                                    onChange={(e) => handleSearchInputChange(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${isSearching ? 'border-orange-300' : 'border-zinc-300'}`}
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Filter Toggle Button */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-md hover:bg-zinc-200 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Filters
                                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Clear Filters Button */}
                            {(searchInput || searchQuery || filters.status || filters.city || filters.state) && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Filter Options */}
                        {showFilters && (
                            <div className="mt-4 pt-4 border-t border-zinc-200">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Status Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1">Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => handleFilterChange('status', e.target.value)}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* City Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            placeholder="Filter by city"
                                            value={filters.city}
                                            onChange={(e) => handleFilterChange('city', e.target.value)}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    {/* Sort By */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1">Sort By</label>
                                        <select
                                            value={filters.sortBy}
                                            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            {sortOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sort Order */}
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1">Order</label>
                                        <select
                                            value={filters.order}
                                            onChange={(e) => handleFilterChange('order', e.target.value)}
                                            className="w-full px-3 py-2 border border-zinc-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            {orderOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Results Summary */}
                        <div className="mt-4 pt-4 border-t border-zinc-200">
                            <p className="text-sm text-zinc-600">
                                Showing {pagination.count} of {pagination.total} issues
                                {searchQuery && (
                                    <span className="ml-1">
                                        for "<strong>{searchQuery}</strong>"
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Map Section */}
                    <section className="mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4">
                            <h2 className="text-xl font-semibold text-zinc-800 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-500" />
                                Issue Locations
                            </h2>
                            <MapUI issues={issues} />
                        </div>
                    </section>

                    {/* Issues Grid */}
                    <section>
                        {issues.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-zinc-400 text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-semibold text-zinc-700 mb-2">No issues found</h3>
                                <p className="text-zinc-600">
                                    {searchQuery || filters.status || filters.city ? 
                                        "Try adjusting your search or filters" : 
                                        "No issues have been reported yet"
                                    }
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                    {issues.map(issue => (
                                        <div 
                                            onClick={() => handleShowIssuePopup(issue)} 
                                            key={issue._id} 
                                            className="bg-white border border-zinc-200 rounded-lg p-4 cursor-pointer hover:shadow-md hover:border-orange-300 transition-all duration-200 group"
                                        >
                                            {/* Issue Header */}
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 text-xs capitalize font-medium rounded-full ${
                                                        issue.status === 'open' ? 'bg-red-100 text-red-700' :
                                                        issue.status === 'in progress' ? 'bg-blue-100 text-blue-700' :
                                                        issue.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        issue.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                                        'bg-zinc-100 text-zinc-700'
                                                    }`}>
                                                        {issue.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(issue.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            </div>

                                            {/* Issue Title */}
                                            <h3 className="font-semibold text-zinc-800 mb-2 group-hover:text-orange-600 transition-colors">
                                                {issue.title}
                                            </h3>

                                            {/* Issue Category */}
                                            {issue.category && (
                                                <p className="text-sm text-orange-600 font-medium mb-2">
                                                    {issue.category}
                                                </p>
                                            )}

                                            {/* Issue Description */}
                                            {issue.userMessage && (
                                                <p className="text-sm text-zinc-700 mb-3 line-clamp-3">
                                                    {issue.userMessage}
                                                </p>
                                            )}

                                            {/* Issue Footer */}
                                            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                                                <div className="flex items-center gap-1 text-sm text-zinc-600">
                                                    <MapPin className="w-4 h-4 text-amber-500" />
                                                    <span>{issue.city}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-zinc-600">
                                                    <TrendingUp className="w-4 h-4 text-orange-500" />
                                                    <span>{issue.votes || 0} votes</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {pagination.totalPages > 1 && !searchQuery && (
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handlePageChange(pagination.page - 1)}
                                            disabled={pagination.page === 1}
                                            className="px-3 py-2 border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Previous
                                        </button>
                                        
                                        {Array.from({ length: pagination.totalPages }, (_, i) => (
                                            <button
                                                key={i + 1}
                                                onClick={() => handlePageChange(i + 1)}
                                                className={`px-3 py-2 border rounded-md ${
                                                    pagination.page === i + 1 
                                                        ? 'bg-orange-500 text-white border-orange-500' 
                                                        : 'border-zinc-300 hover:bg-zinc-50'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(pagination.page + 1)}
                                            disabled={pagination.page === pagination.totalPages}
                                            className="px-3 py-2 border border-zinc-300 rounded-md hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            )}
            
            {/* Issue Popup */}
            {showIssuePopup && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <IssuePopup issue={currentIssue} setShowIssuePopup={setShowIssuePopup} />
                </div>
            )}
        </div>
    )
}

export default CommunityFeed
