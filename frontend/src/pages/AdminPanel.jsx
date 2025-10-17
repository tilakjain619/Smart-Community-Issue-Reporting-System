import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { getAllIssues } from '../api/Issues';
import Stats from '../components/admin/Stats';
import Loader from '../components/extras/Loader';
import IssueChart from '../components/admin/IssueChart';

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
    <div className={`max-w-4xl mx-auto p-4 transition-opacity duration-300 ${showIssuePopup ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'
      }`}>
      {
        loadingIssues ? (
          <div className="flex justify-center items-center h-screen">
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
    </div>
  )
}

export default AdminPanel
