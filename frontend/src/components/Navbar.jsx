import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignOutButton, UserButton, SignedOut, SignInButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useUser();

    return (
        <nav className="bg-yellowOrange px-2 py-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to={user ? '/dashboard' : '/'} className='cursor-pointer w-3/6 sm:w-1/6 h-10 object-cover'><img className='object-cover -ml-6 w-full h-full' src="/light_mode_logo.png" alt="Logo" /></Link>
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
                <div className={`flex-col md:flex-row md:flex items-center ${isOpen ? 'flex' : 'hidden'} md:static absolute top-16 left-0 w-full bg-yellowOrange md:bg-transparent md:w-auto z-10`}>
                    <Link to="/" className="px-1.5 py-2 md:py-0 hover:opacity-60" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/report" className="px-1.5 py-2 md:py-0 hover:opacity-60" onClick={() => setIsOpen(false)}>Report Issue</Link>
                    <Link to="/about" className="px-1.5 py-2 md:py-0 hover:opacity-60" onClick={() => setIsOpen(false)}>About</Link>
                    {/* User section */}
                    <div className="hidden md:flex items-center px-1.5 py-2 md:py-0">
                        <SignedIn>
                            {/* <UserButton /> */}
                            <SignOutButton />
                        </SignedIn>
                        <SignedOut>
                            <SignInButton mode='modal' />
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
                            <SignInButton mode='modal'/>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
