import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* EventWork Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">EventWork</h3>
          <p className="text-gray-300 mb-4">Your platform to hire expert event professionals and find your dream event job.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-300 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Explore Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">Professionals</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Jobs</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Services Column */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-300 hover:text-white">Venue</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Catering</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Entertainment</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Photography & Videography</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Decor & Design</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Event Planning</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Staffing & Support</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Tech & AV</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Marketing & PR</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">Other Services</a></li>
            <li><a href="#" className="text-gray-300 hover:text-white">All Services</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 mt-8 border-t border-gray-800">
        <div className="text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} EventWork. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="text-gray-400 hover:text-white mx-2">Terms & Conditions</a>
            <a href="#" className="text-gray-400 hover:text-white mx-2">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
