import React, { useState } from 'react';
import { Search, Filter, Briefcase } from 'lucide-react';

export default function JobMarketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'design', name: 'Design' },
    { id: 'development', name: 'Development' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'writing', name: 'Writing' }
  ];

  const jobs = [
    {
      id: 1,
      title: 'Website Redesign Project',
      category: 'design',
      budget: '$2,000 - $3,000',
      description: 'Looking for a skilled designer to redesign our company website...',
      postedDate: '2 days ago',
      proposals: 5
    },
    {
      id: 2,
      title: 'Mobile App Development',
      category: 'development',
      budget: '$5,000 - $8,000',
      description: 'Need an experienced developer for building a React Native app...',
      postedDate: '1 day ago',
      proposals: 3
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Job Marketplace</h1>
        <p className="mt-1 text-gray-500">
          Find the perfect job opportunity that matches your skills.
        </p>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="sm:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {jobs.map((job) => (
          <div key={job.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">{job.title}</h2>
                <div className="mt-1 flex items-center space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {job.category}
                  </span>
                  <span className="text-sm text-gray-500">{job.budget}</span>
                  <span className="text-sm text-gray-500">{job.postedDate}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">{job.description}</p>
              </div>
              <div className="ml-4">
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Submit Proposal
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Briefcase className="h-4 w-4 mr-1" />
              {job.proposals} proposals
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
