import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

// SignedIn component - shows content only when user is authenticated
export const SignedIn = ({ children }) => {
    const { isSignedIn } = useAuth();
    return isSignedIn ? children : null;
};

// SignedOut component - shows content only when user is not authenticated
export const SignedOut = ({ children }) => {
    const { isSignedIn } = useAuth();
    return !isSignedIn ? children : null;
};

// SignInButton component - shows a button that opens auth modal
export const SignInButton = ({ children, mode = 'modal' }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button className='cursor-pointer' onClick={() => setShowModal(true)}>
                {children || 'Sign In'}
            </button>
            {mode === 'modal' && (
                <AuthModal 
                    isOpen={showModal} 
                    onClose={() => setShowModal(false)} 
                    mode="login"
                />
            )}
        </>
    );
};

// UserButton component - shows user info and logout option
export const UserButton = () => {
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 text-white hover:bg-blue-700 px-3 py-2 rounded"
            >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user.name || user.email}</span>
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-700 border-b">
                            {user.email}
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                setShowDropdown(false);
                            }}
                            className="block cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// SignOutButton component - simple logout button
export const SignOutButton = ({ children, style, className = '' }) => {
    const { logout } = useAuth();

    return (
        <button
            onClick={logout}
            style={style}
            className={`text-zinc-800 hover:opacity-70 cursor-pointer ${className}`}
        >
            {children || 'Sign Out'}
        </button>
    );
};