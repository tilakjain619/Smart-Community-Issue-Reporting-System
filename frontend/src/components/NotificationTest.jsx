import React, { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { createIssue, updateIssueStatus } from '../api/Issues';
import { assignOfficerToIssue } from '../api/Officers';

const NotificationTest = () => {
    const { notifications, unreadCount, refreshNotifications } = useNotifications();
    const { user, token } = useAuth();
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const addTestResult = (test, status, message) => {
        setTestResults(prev => [...prev, { test, status, message, timestamp: new Date() }]);
    };

    const runTests = async () => {
        if (!user || !token) {
            addTestResult('Authentication', 'error', 'User not authenticated');
            return;
        }

        setLoading(true);
        setTestResults([]);

        try {
            // Test 1: Create a test issue
            addTestResult('Test 1', 'running', 'Creating test issue...');
            const testIssue = {
                title: 'Test Notification Issue',
                userMessage: 'This is a test issue to verify notifications',
                coordinates: { latitude: 40.7128, longitude: -74.0060 },
                imageUrl: 'https://via.placeholder.com/300x200?text=Test+Image'
            };

            const createdIssue = await createIssue(testIssue, token, user.$id);
            addTestResult('Test 1', 'success', `Issue created: ${createdIssue.title}`);

            // Wait a moment for notification to be processed
            await new Promise(resolve => setTimeout(resolve, 2000));
            await refreshNotifications();

            // Test 2: Update issue status
            addTestResult('Test 2', 'running', 'Updating issue status...');
            await updateIssueStatus(createdIssue._id, 'in progress', token);
            addTestResult('Test 2', 'success', 'Issue status updated to in progress');

            // Wait for notification
            await new Promise(resolve => setTimeout(resolve, 2000));
            await refreshNotifications();

            // Test 3: Update to resolved
            addTestResult('Test 3', 'running', 'Resolving issue...');
            await updateIssueStatus(createdIssue._id, 'resolved', token);
            addTestResult('Test 3', 'success', 'Issue resolved');

            // Wait for notification
            await new Promise(resolve => setTimeout(resolve, 2000));
            await refreshNotifications();

            addTestResult('All Tests', 'success', 'All notification tests completed successfully!');

        } catch (error) {
            addTestResult('Error', 'error', `Test failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setTestResults([]);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Notification System Test</h1>
            
            {/* Current Status */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Current Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
                        <div className="text-sm text-gray-600">Unread Notifications</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{notifications.length}</div>
                        <div className="text-sm text-gray-600">Total Notifications</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{testResults.length}</div>
                        <div className="text-sm text-gray-600">Tests Run</div>
                    </div>
                </div>
            </div>

            {/* Test Controls */}
            <div className="mb-6 flex gap-4">
                <button
                    onClick={runTests}
                    disabled={loading || !user}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Running Tests...' : 'Run Notification Tests'}
                </button>
                <button
                    onClick={clearResults}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                    Clear Results
                </button>
                <button
                    onClick={refreshNotifications}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Refresh Notifications
                </button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-3">Test Results</h2>
                    <div className="space-y-2">
                        {testResults.map((result, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg border ${
                                    result.status === 'success' 
                                        ? 'bg-green-50 border-green-200 text-green-800'
                                        : result.status === 'error'
                                        ? 'bg-red-50 border-red-200 text-red-800'
                                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium">{result.test}</span>
                                    <span className="text-sm">
                                        {result.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                                <p className="text-sm mt-1">{result.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Notifications */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Recent Notifications</h2>
                {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">🔔</div>
                        <p>No notifications yet. Run tests to generate some!</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {notifications.slice(0, 10).map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-3 rounded-lg border ${
                                    !notification.isRead 
                                        ? 'bg-blue-50 border-blue-200' 
                                        : 'bg-gray-50 border-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium text-gray-900">
                                        {notification.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            notification.priority === 'high' 
                                                ? 'bg-orange-100 text-orange-800'
                                                : notification.priority === 'urgent'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {notification.priority}
                                        </span>
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(notification.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">How to Test</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Make sure you're logged in</li>
                    <li>2. Click "Run Notification Tests" to create test issues</li>
                    <li>3. Watch the notification bell for new notifications</li>
                    <li>4. Check the notifications page to see all notifications</li>
                    <li>5. Click on notifications to mark them as read</li>
                </ol>
            </div>
        </div>
    );
};

export default NotificationTest;
