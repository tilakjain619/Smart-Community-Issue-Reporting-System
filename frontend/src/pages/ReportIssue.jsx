import React, { useState } from 'react'
import uploadImage from '../utils/uploadImage';
import { useAuth, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { createIssue, testAuth } from '../api/Issues';

const ReportIssue = () => {
    const [fileName, setFileName] = useState('No file chosen');
    const { getToken, isSignedIn } = useAuth();
    console.log(getToken());
    
    

    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        userMessage: '',
        coordinates: null,
        imageUrl: null,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFileName(file ? file.name : 'No file chosen');
        setFile(file);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = await getToken();
            
            if (!token) {
                console.error('No token found - user not authenticated');
                alert('Please sign in to report an issue');
                return;
            }
            // try {
            //     await testAuth(token);
            //     console.log('✅ Authentication successful');
            // } catch (authError) {
            //     console.error('❌ Authentication failed:', authError);
            //     alert('Authentication failed. Please sign in again.');
            //     return;
            // }

            if (!file) {
                alert('Please select an image');
                return;
            }

            // Get location first
            const coordinates = await new Promise((resolve, reject) => {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { latitude, longitude } = position.coords;
                            resolve({ latitude, longitude });
                        },
                        (error) => {
                            reject(error);
                        }
                    );
                } else {
                    reject(new Error("Geolocation is not supported by this browser"));
                }
            });

            console.log('Uploading image...');
            const imageData = await uploadImage(file, token);
            
            console.log('Creating issue...');
            const issueData = {
                userMessage: formData.userMessage,
                coordinates,
                imageUrl: imageData.url,
            };

            await createIssue(issueData, token);
            
            // Clear form
            setFormData({ userMessage: '', coordinates: null, imageUrl: null });
            setFile(null);
            setFileName('No file chosen');
            
            alert("Issue reported successfully!");

        } catch (error) {
            console.error("Error reporting issue:", error);
            alert("Failed to report issue: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-700">Report Issue</h1>
            
            <SignedOut>
                <div className="text-center py-12">
                    <p className="mb-4 text-gray-600">Please sign in to report an issue</p>
                    <SignInButton mode="modal">
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
                            Sign In
                        </button>
                    </SignInButton>
                </div>
            </SignedOut>

            <SignedIn>
                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                            Upload Photo
                        </label>
                        <div className="flex items-center gap-4">
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-200 transition"
                            >
                                Choose File
                            </label>
                            <input
                                accept="image/*"
                                type="file"
                                id="file-upload"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <span id="file-name" className="text-gray-600 line-clamp-1 text-sm">{fileName}</span>
                        </div>
                    </div>
                    <label htmlFor="issue-description" className="block text-sm font-medium text-gray-700 mb-1">
                        Add Message (optional)
                    </label>
                    <textarea
                        placeholder="Describe the issue..."
                        value={formData.userMessage}
                        onChange={(e) => setFormData({ ...formData, userMessage: e.target.value })}
                        className="w-full h-40 outline-none p-2 border border-gray-300 rounded-md mb-4 resize-none"
                    />
                    <button
                        type="submit"
                        className="bg-yellowOrange text-white px-6 py-3 rounded-full hover:opacity-80 transition-opacity"
                    >
                        Submit Report
                    </button>
                </form>
            </SignedIn>
        </div>
    );
};

export default ReportIssue
