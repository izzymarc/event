import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SERVICE_CATEGORIES, ROUTES } from '../lib/constants';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">EventWork</h3>
            <p className="text-gray-400">
              The modern platform connecting event professionals and clients.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.SIGN_UP} className="hover:text-white transition-colors">
                  How to Hire
                </Link>
              </li>
              <li>
                <Link to={ROUTES.JOBS} className="hover:text-white transition-colors">
                  Find Professionals
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-white transition-colors">
                  Post a Job
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Payment Options
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Client Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">For Professionals</h3>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.SIGN_UP} className="hover:text-white transition-colors">
                  Find Work
                </Link>
              </li>
              <li>
                <Link to={ROUTES.JOBS} className="hover:text-white transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Get Paid
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Professional Resources
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Success Stories
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
              </li>
              <li>
                <Link to="/press" className="hover:text-white transition-colors">Press</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Browse Services</h3>
            <ul className="space-y-2">
              {SERVICE_CATEGORIES.map(category => (
                <li key={category.id}>
                  <Link to={`/jobs?category=${category.id}`} className="hover:text-white transition-colors">
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to={ROUTES.JOBS} className="hover:text-white transition-colors">
                  All Services
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} EventWork. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
