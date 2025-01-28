import React from 'react';
import { FileText, Clock, DollarSign } from 'lucide-react';

export default function ProposalList() {
  const proposals = [
    {
      id: 1,
      jobTitle: 'Website Redesign Project',
      client: 'Tech Corp',
      status: 'pending',
      submittedDate: '2 days ago',
      budget: '$2,000',
      description: 'Proposal for complete website redesign including UI/UX improvements...'
    },
    {
      id: 2,
      jobTitle: 'Mobile App Development',
      client: 'StartUp Inc',
      status: 'accepted',
      submittedDate: '1 week ago',
      budget: '$5,000',
      description: 'Development proposal for React Native mobile application...'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
        <p className="mt-1 text-gray-500">
          Track and manage your submitted proposals
        </p>
      </div>

      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {proposals.map((proposal) => (
          <div key={proposal.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">
                  {proposal.jobTitle}
                </h2>
                <div className="mt-1 flex items-center space-x-4">
                  <span className="text-sm text-gray-500">{proposal.client}</span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      proposal.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {proposal.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {proposal.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {proposal.submittedDate}
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {proposal.budget}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
