import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  Shield,
  Zap,
  MessageSquare,
  CreditCard,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Search
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../lib/constants';
import Atinuda2025 from '../atinuda/Atinuda2025'; // Import the Atinuda2025 component
import WhyChooseUs from './WhyChooseUs'; // Import WhyChooseUs component
import Footer from '../Footer'; // Import Footer component
import Navigation from '../Navigation'; //import Navigation component

export default function LandingPage() {
  // const [searchQuery, setSearchQuery] = useState(''); // remove unused searchQuery
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Access a global network of vetted event professionals. Find the perfect talent for any event, from planners to vendors.',
      color: 'bg-blue-500'
    },
    {
      icon: Briefcase,
      title: 'Seamless Job Marketplace',
      description: 'Post event opportunities and browse listings effortlessly. Our intelligent matching system connects you with the right people, faster.',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure & Protected Payments',
      description: 'Enjoy peace of mind with our secure payment processing. Our escrow service ensures safe and reliable transactions for every project.',
      color: 'bg-green-500'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Collaboration',
      description: 'Communicate and collaborate with clients and vendors seamlessly using our integrated messaging system. Keep all your project communications in one place.',
      color: 'bg-pink-500'
    },
    {
      icon: Award,
      title: 'Verified Professionals',
      description: 'Rest assured knowing you are hiring from a pool of verified and highly-rated event professionals. Quality and reliability guaranteed.',
      color: 'bg-yellow-500'
    },
    {
      icon: TrendingUp,
      title: 'Boost Your Business',
      description: 'For professionals, EventWork is your platform to reach more clients, showcase your portfolio, and grow your event business faster than ever.',
      color: 'bg-orange-500'
    },
    {
      icon: CheckCircle,
      title: 'Project Management Tools',
      description: 'Manage your event projects efficiently with our built-in project management tools. From milestones to deadlines, stay organized and in control.',
      color: 'bg-teal-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Event Director, TechConf',
      content: 'EventWork has transformed how we organize our tech conferences. The platform is intuitive, and the talent pool is exceptional.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'CEO, Gourmet Catering Co.',
      content: 'As a vendor, finding quality clients has never been easier. The payment protection gives me peace of mind.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Wedding Planner',
      content: 'The platform has helped me expand my business beyond my local market. The tools are perfect for event professionals.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80',
      rating: 5
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '$2M+', label: 'Transactions' },
    { value: '95%', label: 'Satisfaction Rate' },
    { value: '50+', label: 'Countries' }
  ];

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement search functionality here, e.g., navigate to jobs page with search query
    console.log('Search query:', searchQuery);
    // For now, let's just navigate to the jobs page (you can modify this)
    window.location.href = `/jobs?search=${searchQuery}`;
  };


  return (
    <div className="bg-white">
      <Navigation />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            filter: 'brightness(0.6)', // Slightly brighter image
            backgroundBlendMode: 'soft-light, overlay', // Blend modes
            backgroundColor: 'rgba(0, 0, 0, 0.2)', // Slightly lighter overlay
            backgroundImage: 'linear-gradient(to right, #4f46e5, #3b82f6)' // Example gradient (indigo to blue)
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="pt-20 pb-24 sm:pt-32 sm:pb-40">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl font-serif-heading">
                <span className="block">Hire Top Event Talent &</span>
                <span className="block text-indigo-400">Find Your Dream Event Job.</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300 sm:max-w-3xl">
                Connect with vetted event planners, vendors, and freelancers. Clients post jobs and manage proposals, while professionals showcase expertise and get hired.
              </p>
              {/* Search Bar */}
              <motion.form
                onSubmit={handleSearchSubmit}
                className="mt-8 max-w-md mx-auto w-full"
              >
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="search"
                    name="search"
                    id="search"
                    placeholder="Try 'Wedding Planner in Lagos' or 'Corporate Event Planner'"
                    className="block w-full rounded-full border-0 bg-white py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </motion.form>

              <div className="mt-10 flex justify-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                  to="/signin"
                  className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-white bg-transparent hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Login
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Browse Categories Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-extrabold text-gray-900">
              Browse Event Services
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Explore top categories and find the right professionals for your event needs.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICE_CATEGORIES.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * SERVICE_CATEGORIES.indexOf(category) }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <Link to={`/jobs?category=${category.id}`} className="block p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-500">Find {category.name} experts</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>


      {/* Stats Section */}
      <div className="bg-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold text-white">10K+</div>
              <div className="mt-2 text-sm text-indigo-200">Active Users</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold text-white">$2M+</div>
              <div className="mt-2 text-sm text-indigo-200">Transactions</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold text-white">95%</div>
              <div className="mt-2 text-sm text-indigo-200">Satisfaction Rate</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-extrabold text-white">50+</div>
              <div className="mt-2 text-sm text-indigo-200">Countries</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-extrabold text-gray-900">
              Powering the event industry with innovation
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Explore the features that make EventWork the platform of choice for event professionals and businesses.
            </p>
          </motion.div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -8 }}
                    className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className={`absolute top-6 left-6 p-3 rounded-lg ${feature.color} bg-opacity-10`}>
                      <feature.icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="pt-12">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-900">
              What Our Users Say
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Hear from event professionals and clients who trust EventWork
            </p>
          </motion.div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-full object-cover"
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <div className="ml-4">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-gray-600 italic">"{testimonial.content}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Atinuda2025 Section */}
      <div className="mt-24">
        <Atinuda2025 />
      </div>

      {/* CTA Section */}
      <div className="relative bg-indigo-600 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80)'
          }}
        />
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to take your events to the next level?
              </h2>
              <p className="mt-4 text-xl text-indigo-100">
                Join EventWork today and start connecting with the best event professionals in the industry.
              </p>
              <div className="mt-8 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/signup"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-indigo-600 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
       <Footer />
    </div>
  );
}
