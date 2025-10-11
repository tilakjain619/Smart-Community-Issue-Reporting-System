import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
    const [currentMode, setCurrentMode] = useState(mode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (currentMode === 'login') {
                const result = await login(email, password);
                if (result.success) {
                    onClose();
                } else {
                    setError(result.error);
                }
            } else {
                const result = await register(email, password, name);
                if (result.success) {
                    onClose();
                } else {
                    setError(result.error);
                }
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#000002c7] backdrop-blur-xs flex items-center justify-center z-50">
            <div className="bg-white text-zinc-800 text-left p-6 rounded-lg w-96 max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl text-zinc-600 font-bold">
                        {currentMode === 'login' ? 'Sign In' : 'Sign Up'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 cursor-pointer hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {currentMode === 'register' && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full outline-none p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full outline-none p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 outline-none border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    {error && (
                        <div className="mb-4 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-yellowOrange cursor-pointer text-white py-2 px-4 rounded-md hover:bg-amber-300"
                    >
                        {loading ? 'Loading...' : (currentMode === 'login' ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => setCurrentMode(currentMode === 'login' ? 'register' : 'login')}
                        className="text-zinc-600 text-sm cursor-pointer hover:underline"
                    >
                        {currentMode === 'login' 
                            ? "Don't have an account? Sign up" 
                            : "Already have an account? Sign in"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;