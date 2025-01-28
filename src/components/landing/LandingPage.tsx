import React from 'react';
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
  TrendingUp
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Connect with top-tier event professionals and vendors worldwide.',
      color: 'bg-blue-500'
    },
    {
      icon: Briefcase,
      title: 'Job Marketplace',
      description: 'Find and post event opportunities with our intelligent matching system.',
      color: 'bg-purple-500'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Protected transactions with our advanced escrow service.',
      color: 'bg-green-500'
    },
    {
      icon: MessageSquare,
      title: 'Real-time Chat',
      description: 'Seamless communication between clients and vendors.',
      color: 'bg-pink-500'
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

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80)',
            filter: 'brightness(0.4)'
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
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Transform Your</span>
                <span className="block text-indigo-400">Event Business</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-xl text-gray-300 sm:max-w-3xl">
                Connect with top event professionals, manage projects seamlessly, and grow your business with our all-in-one platform.
              </p>
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
                    <ArrowRight className="ml-2 h-5 w-5" />
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
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="mt-2 text-sm text-indigo-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900">
                Everything you need to succeed
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Powerful tools and features designed for the modern event industry
              </p>
            </motion.div>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="relative bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all"
                  >
                    <div className={`absolute top-6 left-6 p-3 rounded-lg ${feature.color} bg-opacity-10`}>
                      <Icon className={`h-6 w-6 ${feature.color.replace('bg-', 'text-')}`} />
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

      {/* Testimonials */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold text-gray-900">
                Trusted by event professionals
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                Join thousands of successful event businesses
              </p>
            </motion.div>
          </div>

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
                Ready to grow your event business?
              </h2>
              <p className="mt-4 text-xl text-indigo-100">
                Join thousands of event professionals already using EventWork
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
    </div>
  );
}
