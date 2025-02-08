import React from 'react';
import { useProposals } from '../../lib/hooks/useProposals'; // We'll create this hook next
import { LoadingPage } from '../ui/LoadingSpinner';
import { formatCurrency } from '../../lib/utils';

interface ProposalListProps {
  jobId: string;
}

export default function ProposalList({ jobId }: ProposalListProps) {
  const { proposals, loading, error } = useProposals(jobId);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error loading proposals: {error}</div>;
  }

  if (!proposals || proposals.length === 0) {
    return <div>No proposals have been submitted for this job yet.</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">Proposals</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {proposals.map((proposal: any) => ( // Replace 'any' with a proper type later
            <li key={proposal.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {/* Display vendor avatar (replace with actual image if available) */}
                  <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                    {proposal.vendor?.full_name ? proposal.vendor.full_name.charAt(0) : '?'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {proposal.vendor?.full_name || 'Unknown Vendor'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {proposal.content}
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {formatCurrency(proposal.price)}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
