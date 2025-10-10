import axios from 'axios';
import React, { useState, useEffect } from 'react'
import Loader from '../components/extras/Loader';
import MapUI from '../components/MapUI';

const CommunityFeed = () => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const BASE_API_URL = import.meta.env.VITE_BACKEND_URL;
    const [showIssuePopup, setShowIssuePopup] = useState(false);
    const [currentIssue, setCurrentIssue] = useState(null);

    const handleShowIssuePopup = (issue) => {
        setCurrentIssue(issue);
        setShowIssuePopup(true);
    }
    const fetchIssues = async () => {

        try {
            setLoading(true);
            const issues = await axios.get(`${BASE_API_URL}/api/issues`);

            setIssues(issues.data.issues);
        } catch (error) {
            console.error("Error fetching user issues:", error)
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchIssues();
    }, [])
    return (
        <div className="relative">
            {
                loading ? (
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
                            <MapUI issues={issues} />
                        </section>
                        {issues.map(issue => (
                            <div key={issue._id}>
                                <h2>{issue.title}</h2>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default CommunityFeed
