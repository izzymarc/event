import React from 'react';

const Navigation = () => {
  return (
    <nav className="w-full bg-white z-50 sticky top-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div>
            <a href="/" className="text-lg font-semibold text-gray-900">
              EventWork
            </a>
          </div>

          {/* Main Navigation */}
          <div className="flex space-x-8">
            <a href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </a>
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900">
                Browse Services
              </button>
              <div className="absolute hidden group-hover:block bg-white shadow-md mt-1 rounded-md w-[700px] left-0">
                <div className="p-4 grid grid-cols-3 gap-4">
                  <div>
                    <h6 className="font-semibold mb-2">By Category</h6>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/jobs?category=venue" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Venue</a></li>
                      <li><a href="/jobs?category=catering" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Catering</a></li>
                      <li><a href="/jobs?category=entertainment" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Entertainment</a></li>
                      <li><a href="/jobs?category=photography" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Photography & Videography</a></li>
                      <li><a href="/jobs?category=decor" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Decor & Design</a></li>
                      <li><a href="/jobs?category=planning" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Event Planning</a></li>
                      <li><a href="/jobs?category=staffing" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Staffing & Support</a></li>
                      <li><a href="/jobs?category=tech" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Tech & AV</a></li>
                      <li><a href="/jobs?category=marketing" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Marketing & PR</a></li>
                      <li><a href="/jobs?category=other" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Other Services</a></li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold mb-2">About EventWork</h6>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/about" className="block px-4 py-2 hover:bg-gray-100 rounded-md">About Us</a></li>
                      <li><a href="/contact" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Contact</a></li>
                      <li><a href="/terms" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Terms & Conditions</a></li>
                      <li><a href="/privacy" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Privacy Policy</a></li>
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-semibold mb-2">Quick Links</h6>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/help" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Help & Support</a></li>
                      <li><a href="/faq" className="block px-4 py-2 hover:bg-gray-100 rounded-md">FAQ</a></li>
                      <li><a href="/sitemap" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Sitemap</a></li>
                      <li><a href="/feedback" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Feedback</a></li>
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
                  <li><a href="/professionals/find-jobs" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Find Jobs</a></li>
                  <li><a href="/professionals/create-profile" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Create Profile</a></li>
                  <li><a href="/professionals/pricing" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Pricing</a></li>
                  <li className="hidden"><a href="/professionals/resources" className="block px-4 py-2 hover:bg-gray-100 rounded-md">Resources</a></li>
                </ul>
              </div>
            </div>
            <a href="/about" className="text-gray-600 hover:text-gray-900 hidden md:block">
              About
            </a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900 hidden md:block">
              Contact
            </a>
          </div>

          {/* Auth Links */}
          <div className="flex items-center space-x-6">
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </a>
            <a href="/signup" className="text-gray-600 hover:text-gray-900">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
