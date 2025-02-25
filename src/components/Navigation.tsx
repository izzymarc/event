import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const Navigation = () => {
  return (
    <nav className="w-full bg-white z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div>
            <Link to="/" className="text-lg font-semibold text-gray-900">
              EventWork
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900">
                Browse Services
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-md mt-1 rounded-md w-[700px] left-0">
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div>
                    <h6 className="font-semibold mb-2">By Category</h6>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/jobs?category=venue" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Venue</Link></li>
                      <li><Link to="/jobs?category=catering" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Catering</Link></li>
                      <li><Link to="/jobs?category=entertainment" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Entertainment</Link></li>
                      <li><Link to="/jobs?category=photography" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Photography & Videography</Link></li>
                      <li><Link to="/jobs?category=decor" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Decor & Design</Link></li>
                      <li><Link to="/jobs?category=planning" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Event Planning</Link></li>
                      <li><Link to="/jobs?category=staffing" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Staffing & Support</Link></li>
                      <li><Link to="/jobs?category=tech" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Tech & AV</Link></li>
                      <li><Link to="/jobs?category=marketing" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Marketing & PR</Link></li>
                      <li><Link to="/jobs?category=other" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Other Services</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold mb-2">About EventWork</h6>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/about" className="block px-4 py-2 hover:bg-gray-100 rounded-md">About Us</Link></li>
                      <li><Link to="/contact" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Contact</Link></li>
                      <li><Link to="/terms" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Terms & Conditions</Link></li>
                      <li><Link to="/privacy" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Privacy Policy</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold mb-2">Quick Links</h6>
                    <ul className="space-y-2 text-sm">
                      <li><Link to="/help" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Help & Support</Link></li>
                      <li><Link to="/faq" className="block px-4 py-2 hover:bg-gray-100 rounded-md">FAQ</Link></li>
                      <li><Link to="/sitemap" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Sitemap</Link></li>
                      <li><Link to="/feedback" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Feedback</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900">
                For Professionals
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-md mt-1 rounded-md w-48">
                <ul className="py-2 text-sm text-gray-700">
                  <li><Link to="/professionals/find-jobs" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Find Jobs</Link></li>
                  <li><Link to="/professionals/create-profile" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Create Profile</Link></li>
                  <li><Link to="/professionals/pricing" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Pricing</Link></li>
                  <li className="hidden"><Link to="/professionals/resources" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Resources</Link></li>
                </ul>
              </div>
            </div>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 hidden md:block">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900 hidden md:block">
              Contact
            </Link>
          </div>

          {/* Auth Links */}
          <div className="flex items-center space-x-6">
            <Link to="/signin" className="text-gray-600 hover:text-gray-900"> {/* Changed to Link */}
              Login
            </Link>
            <Link to="/signup" className="text-gray-600 hover:text-gray-900"> {/* Changed to Link */}
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
