import { Link } from "react-router-dom";
import { AlertCircle, Sparkles, ArrowLeft } from "lucide-react";

//  Reusable LinkComponent styling
function LinkComponent({ children, className = "", ...props }) {
  return (
    <Link
      className={`inline-flex items-center cursor-pointer justify-center px-6 py-3 rounded-full transition-all duration-200 font-semibold ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen  flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 text-gray-900 overflow-hidden relative    ">
       {/* Background orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-[#ff9a47]/20 rounded-full blur-[120px]" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-300/30 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 -top-12">
        <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-full px-4 py-2 mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#ff9a47]" />
          <span className="text-sm text-gray-700">Stay Aware. Stay Jagruk.</span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#ff9a47] to-orange-500 rounded-3xl flex items-center justify-center shadow-xl shadow-[#ff9a47]/30">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-6xl sm:text-7xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-10">
          Oops! The page you’re looking for doesn’t exist or may have been moved.  
          Don’t worry, you can go back and continue exploring your community.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <LinkComponent
            to="/"
            className="bg-gradient-to-r from-[#ff9a47] to-orange-500 hover:from-[#ff9a47]/90 hover:to-orange-500/90 text-white shadow-lg shadow-[#ff9a47]/30"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Home
          </LinkComponent>

          <LinkComponent
            to="/community"
            className="bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-900 border border-gray-200/50 shadow-md"
          >
            View Community Issues
          </LinkComponent>
        </div>
      </div>

      {/* Footer message */}
      <div className="absolute bottom-20 text-gray-500 text-sm">
        &copy; 2025 Jagruk • Building Better Communities
      </div>
    </div>
  );
}
