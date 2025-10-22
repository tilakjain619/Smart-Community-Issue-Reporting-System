import { Link } from 'react-router-dom'
import { getUsersIssues } from '../api/Issues'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext';
import { SignedIn, SignedOut, SignInButton } from '../components/AuthComponents';
import IssuePopup from '../components/IssuePopup'
import Loader from '../components/extras/Loader'
import MapUI from '../components/MapUI'

const Dashboard = () => {
  const [userIssues, setUserIssues] = useState([])
  const { user, getToken, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showIssuePopup, setShowIssuePopup] = useState(false);
  const [currentIssue, setCurrentIssue] = useState(null);

  const handleShowIssuePopup = (issue) => {
    setCurrentIssue(issue);
    setShowIssuePopup(true);
  }
  
  const fetchUserIssues = async () => {
    if (!user) return;
    
    
    try {
      setLoading(true);
      const token = await getToken();
      const userId = user.$id; // according to Appwrite user ID format
      const issues = await getUsersIssues(token, userId)
      setUserIssues(issues);
    } catch (error) {
      console.error("Error fetching user issues:", error)
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    if (user) {
      fetchUserIssues();
    }
  }, [user])

  return (
    <div className="relative">
      <SignedOut>
        <div className="max-w-4xl mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold mb-4 text-zinc-800">Access Your Dashboard</h1>
          <p className="mb-4 text-gray-600">Please sign in to view your reported issues and dashboard.</p>
          <SignInButton>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
              Sign In
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        {
          loading || authLoading ? (
            <div className="flex justify-center items-center h-screen">
              <Loader />
            </div>
          ) : (
          <div
            className={`max-w-4xl mx-auto p-4 transition-opacity duration-300 ${showIssuePopup ? 'opacity-40 blur-sm pointer-events-none' : 'opacity-100'
              }`}
          >
            <section aria-labelledby="issue-locations-heading">
              <h1 id="issue-locations-heading" className="text-2xl font-bold mb-4 text-zinc-800">
                Reported Locations
              </h1>
              <MapUI issues={userIssues} />
            </section>

            <section className='mt-4'>
              <h1 className="text-2xl font-bold mb-6 text-zinc-800">Your Issue Summary</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-yellow-300 to-amber-400 shadow-lg px-6 py-6 rounded-xl flex flex-col">
                  <h2 className="text-base font-semibold text-zinc-700 mb-2">Total Reports</h2>
                  <span className="text-4xl font-extrabold text-zinc-900">{userIssues.length}</span>
                </div>
                <div className="bg-gradient-to-br from-green-300 to-green-400 shadow-lg px-6 py-6 rounded-xl flex flex-col">
                  <h2 className="text-base font-semibold text-zinc-700 mb-2">Resolved</h2>
                  <span className="text-4xl font-extrabold text-zinc-900">{userIssues.filter(issue => issue.status === 'resolved').length}</span>
                </div>
                <div className="bg-gradient-to-br from-red-300 to-red-400 shadow-lg px-6 py-6 rounded-xl flex flex-col">
                  <h2 className="text-base font-semibold text-zinc-700 mb-2">Pending</h2>
                  <span className="text-4xl font-extrabold text-zinc-900">{userIssues.filter(issue => issue.status === 'pending').length}</span>
                </div>
                <div className="bg-gradient-to-br from-yellow-200 to-yellow-300 shadow-lg px-6 py-6 rounded-xl flex flex-col">
                  <h2 className="text-base font-semibold text-zinc-700 mb-2">In-Progress</h2>
                  <span className="text-4xl font-extrabold text-zinc-900">{userIssues.filter(issue => issue.status === 'in-progress').length}</span>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-4 text-zinc-800">Recent Activity</h2>
              {userIssues.length === 0 ? (
                <p className="text-zinc-500 mb-6">No recent activity to display.</p>
              ) : (
                <ul className="mb-6">
                  {userIssues.slice(0, 5).map(issue => (
                    <li onClick={() => handleShowIssuePopup(issue)} key={issue._id} className="bg-white cursor-pointer rounded-lg shadow p-4 mb-2 flex justify-between items-center">
                      <span className="font-medium text-zinc-700">{issue.title}</span>
                      <span className={`px-3 py-1 capitalize rounded-full text-xs font-bold ${issue.status === 'resolved' ? 'bg-green-200 text-green-800' :
                          issue.status === 'pending' ? 'bg-red-200 text-red-800' :
                            issue.status === 'in-progress' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-amber-200 text-amber-800'
                        }`}>
                        {issue.status.replace('-', ' ')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg px-6 py-6 rounded-xl flex flex-col mb-6">
                <h2 className="text-base font-semibold text-zinc-700 mb-2">Issues Open</h2>
                <span className="text-4xl font-extrabold text-zinc-800">{userIssues.filter(issue => issue.status === 'open').length}</span>
              </div>
            </section>
            <div className="flex justify-end">
              <Link
                to="/report"
                className="bg-yellow-500 hover:bg-yellow-600 text-zinc-800 transition px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                Report New Issue
              </Link>
            </div>
          </div>
        )}

        {
          showIssuePopup && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <IssuePopup issue={currentIssue} setShowIssuePopup={setShowIssuePopup} />
            </div>
          )
        }
      </SignedIn>
    </div>
  )
}

export default Dashboard
