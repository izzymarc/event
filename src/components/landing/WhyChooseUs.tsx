import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Users, Handshake, Briefcase, Award } from 'lucide-react';

const WhyChooseUs = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Vetted Professionals',
      description: 'Access a network of pre-screened and highly skilled event professionals.',
    },
    {
      icon: Briefcase,
      title: 'Wide Range of Talent',
      description: 'Find professionals for every event role, from planning to execution.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      description: 'Ensure secure and reliable transactions through our protected payment system.',
    },
    {
      icon: Handshake,
      title: 'Easy Collaboration',
      description: 'Seamlessly manage projects and communicate with professionals on one platform.',
    },
    {
        icon: CheckCircle,
        title: 'Streamlined Hiring',
        description: 'Simplify your hiring process and find the perfect match quickly.',
      },
      {
        icon: Award,
        title: 'Quality & Reliability',
        description: 'Connect with top-tier talent and ensure successful event outcomes.',
      },
  ];

  return (
    <div className="bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-extrabold text-gray-900">
            Why Choose EventWork?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover the benefits of using EventWork for your event needs.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="p-4 bg-indigo-100 text-indigo-600 rounded-full mb-4">
                <benefit.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
