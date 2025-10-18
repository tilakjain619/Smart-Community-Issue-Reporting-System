import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAllIssues } from '../api/Issues';
import Stats from '../components/admin/Stats';
import Loader from '../components/extras/Loader';
import IssueChart from '../components/admin/IssueChart';
import { BarChart3, Activity, FileText, ToolCase, HelpingHand } from 'lucide-react';
import ManageIssues from './ManageIssues';
import ManageOfficers from './ManageOfficers';
import Logs from './Logs';

const AdminPanel = () => {
  const { isAdmin, loading, getToken } = useAuth();
  const isAdminUser = isAdmin();
  if (loading) return <div className="h-[90vh] grid items-center justify-center"><Loader /></div>;
  if (!isAdminUser) return <div className="h-[90vh] grid items-center justify-center">
    <h2>You do not have access to this page</h2>
  </div>;
  const [issues, setIssues] = useState([]);
  const [showIssuePopup, setShowIssuePopup] = useState(false);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, logs


  const fetchIssues = async () => {
    try {
      setLoadingIssues(true);
      const token = await getToken();
      const data = await getAllIssues(token);
      setIssues(data);
    } catch (error) {
      alert("Error fetching issues");
    } finally {
      setLoadingIssues(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);
  return (
    <div className={`max-w-6xl mx-auto p-4 transition-opacity duration-300 ${showIssuePopup ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'}`}>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex overflow-x-auto space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center whitespace-nowrap gap-2">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </div>
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'logs'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center whitespace-nowrap gap-2">
                <Activity className="w-4 h-4" />
                Activity Logs
              </div>
            </button>
            <button
              onClick={() => setActiveTab('issues')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'issues'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center whitespace-nowrap gap-2">
                <ToolCase className="w-4 h-4" />
                Manage Issues
              </div>
            </button>
            <button
              onClick={() => setActiveTab('officers')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'officers'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center whitespace-nowrap gap-2">
                <HelpingHand className="w-4 h-4" />
                Manage Officers
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && (
        <>
          {loadingIssues ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <>
              {/* Basic statistics */}
              <Stats issues={issues} />
              {/* Issue Distribution Chart & Graph */}
              <IssueChart issues={issues} />
            </>
          )}
        </>
      )}

      {activeTab === 'logs' && (
        <Logs />
      )}
      {
        activeTab === 'issues' && (<ManageIssues />)
      }
      {
        activeTab === 'officers' && (<ManageOfficers />)
      }
    </div>
  )
}

export default AdminPanel
