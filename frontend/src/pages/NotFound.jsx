import { Home, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50      
  text-gray-900 overflow-hidden flex items-center justify-center px-4">
            {/* Background grid */}
            <div className="fixed z-0 inset-0 bg-[linear-gradient(to_right,#ff9a4715_1px,transparent_1px),linear-gradient(to_bottom,#ff9a4715_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

            {/* Background blurred orbs */}
            <div className="fixed top-20 left-10 w-72 h-72 bg-[#ff9a47]/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-[120px] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center">
                {/* 404 Icon/Number */}
                <div className="mb-8 inline-block">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#ff9a47] to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-[#ff9a47]/30 mb-6 mx-auto">
                        <span className="text-6xl font-bold text-white">404</span>
                    </div>
                </div>

                {/* Heading */}
                <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900  via-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Page Not Found
                </h1>

                {/* Description */}
                <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
                    Oops! The page you're looking for doesn't exist. It might have been moved or
                    deleted. Let's get you back on track!
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff9a47] to-orange-500 hover:from-[#ff9a47]/90 hover:to-orange-500/90 text-white font-semibold shadow-2xl shadow-[#ff9a47]/30 transition-all duration-200 group"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        to="/community"
                        className="inline-flex items-center justify-center px-8 py-4 rounded-full  bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-900 font-semibold border  border-gray-200/50 shadow-lg transition-all duration-200"
                    >
                        View Reports
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-16 pt-12 border-t border-gray-200/30">
                    <p className="text-sm text-gray-600 mb-6">Quick Navigation</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
                        {[
                            { label: 'Home', path: '/' },
                            { label: 'Report Issue', path: '/report' },
                            { label: 'Community', path: '/community' },
                            { label: 'Dashboard', path: '/dashboard' }
                        ].map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="p-3 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:shadow-lg transition-all text-sm font-medium   text-gray-700"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}