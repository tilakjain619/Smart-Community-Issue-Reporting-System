import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton, SignOutButton } from '../components/AuthComponents'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, isAdmin } = useAuth();
    const admin = isAdmin();

    return (
        <nav className="bg-white z-40 px-2 py-4 text-gray-900 shadow-xs">
            <div className="container mx-auto flex justify-between items-center">
                <Link to={user ? '/dashboard' : '/'} className='cursor-pointer w-2/6 sm:w-1/12 h-10'><img className=' object-contain w-full h-full' src="/light_mode_logo.png" alt="Logo" /></Link>
                <button
                    className="flex md:hidden cursor-pointer items-center px-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation"
                >
                    <svg
                        className="w-6 h-6 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        style={{
                            transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s',
                        }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                        />
                    </svg>
                </button>
                <div className={`flex-col bg-[#ffffff88] backdrop-blur-md md:backdrop-blur-none z-20 md:flex-row ${isOpen ? 'flex' : 'hidden'} md:flex gap-3 items-center md:static absolute top-16 left-0 w-full md:bg-transparent md:w-auto z-10`}>
                    {
                        !admin && (
                            <>
                                <Link to={user ? '/dashboard' : '/'} className="px-1 py-2 md:py-0 hover:opacity-60" onClick={() => setIsOpen(false)}>{user ? 'Dashboard' : 'Home'}</Link>
                                <Link to="/community" className="px-1 py-2 md:py-0 hover:opacity-60" onClick={() => setIsOpen(false)}>Community Feed</Link>
                                <Link to="/report" className="px-1 py-2 md:py-0 hover:opacity-60" onClick={() => setIsOpen(false)}>Report Issue</Link>
                            </>
                        )
                    }
                    {admin && (
                        <Link to="/admin/dashboard" className="px-1 py-2 md:py-0 hover:opacity-60" onClick={() => setIsOpen(false)}>Dashboard</Link>
                    )}
                    {/* User section */}
                    <div className="hidden md:flex items-center px-1 py-2 md:py-0">
                        <SignedIn>
                            <div className='flex items-center gap-2'>
                                {/* <UserButton /> */}
                                <SignOutButton style={{ cursor: 'pointer' }} />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode='modal' style={{ cursor: 'pointer' }} />
                        </SignedOut>
                    </div>
                    {/* User section for mobile */}
                    <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} px-1 py-2 pb-3 md:py-0`}>
                        <SignedIn>
                            <div className='flex items-center gap-2'>
                                {/* <UserButton /> */}
                                <SignOutButton />
                            </div>
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode='modal' />
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
