import React from 'react';
import { useProposals } from '../../lib/hooks/useProposals';
import { LoadingPage } from '../ui/LoadingSpinner';
import { formatCurrency } from '../../lib/utils';

export default function AllProposalsList() {
  // Call useProposals without jobId to fetch all proposals
  const { proposals, loading, error } = useProposals();

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error loading proposals: {error}</div>;
  }

  if (!proposals || proposals.length === 0) {
    return <div>No proposals have been submitted yet.</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">All Proposals</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {proposals.map((proposal: any) => (
            <li key={proposal.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 pt-1">
                  {/* Display vendor avatar */}
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    {proposal.vendor?.avatar_url ? (
                      <img src={proposal.vendor.avatar_url} alt="Vendor Avatar" className="h-full w-full object-cover rounded-full" />
                    ) : (
                      <span>{proposal.vendor?.full_name ? proposal.vendor.full_name.charAt(0).toUpperCase() : '?'}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="md:flex md:justify-between text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {proposal.vendor?.full_name || 'Unknown Vendor'}
                    </p>
                    <div className="mt-2 md:mt-0">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {formatCurrency(proposal.price)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {proposal.content}
                  </p>
                   {proposal.cover_letter && (
                    <p className="text-sm text-gray-700 mt-2">
                      Cover Letter: {proposal.cover_letter}
                    </p>
                  )}
                  {proposal.portfolio_items && proposal.portfolio_items.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-700">Portfolio Items:</h4>
                      <ul className="mt-2 grid grid-cols-2 gap-2">
                        {proposal.portfolio_items.map((item: any) => (
                          <li key={item.portfolio_item.id} className="relative">
                            <img
                              src={item.portfolio_item.image_url || 'fallback-image-url.png'} // Replace with a fallback image URL
                              alt={item.portfolio_item.title}
                              className="rounded-md aspect-video object-cover"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 hover:opacity-80 transition-opacity duration-200 flex items-center justify-center">
                              <a 
                                href={item.portfolio_item.project_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-white text-sm font-medium"
                              >
                                View Project
                              </a>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{item.portfolio_item.title}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
