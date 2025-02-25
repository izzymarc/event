import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Lightbulb, Users, CalendarCheck } from 'lucide-react';
import { Link } from 'react-router-dom'; // Import Link

const AboutPage = () => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
            About EventWork
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our mission is to streamline the event planning process by connecting talented event professionals with clients seeking top-notch services. We empower both sides of the event industry to thrive.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Briefcase className="h-10 w-10 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              For Clients
            </h3>
            <p className="text-gray-600">
              Find and hire vetted event professionals for any occasion. Post jobs, review proposals, and manage your event planning seamlessly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Lightbulb className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              For Professionals
            </h3>
            <p className="text-gray-600">
              Showcase your expertise, discover new job opportunities, and grow your freelance event business. Connect with clients and manage your projects efficiently.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Users className="h-10 w-10 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Our Community
            </h3>
            <p className="text-gray-600">
              Join a vibrant community of event planners, vendors, and freelancers. Network, collaborate, and find support within the EventWork community.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="p-6 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <CalendarCheck className="h-10 w-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Our Vision
            </h3>
            <p className="text-gray-600">
              To be the leading platform that empowers event professionals and clients to create unforgettable experiences, together.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-8">
            Ready to get started with EventWork?
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Join EventWork Today
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
