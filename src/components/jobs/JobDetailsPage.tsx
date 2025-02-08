import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useJob } from '../../lib/hooks/useJob';
import { LoadingPage } from '../ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../../lib/utils';
import SubmitProposal from '../proposals/SubmitProposal';
import { useAuth } from '../../contexts/AuthContext';
import ProposalList from '../proposals/ProposalList'; // Import ProposalList

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const { job, loading, error, refresh } = useJob(jobId || '');
  const { user } = useAuth();
  const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false);

  useEffect(() => {
    const checkIfSubmitted = async () => {
      if (user && user.role === 'vendor' && job) {
        const { data, error } = await supabase
          .from('proposals')
          .select('id')
          .eq('job_id', job.id)
          .eq('vendor_id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error checking for existing proposal:", error);
        } else {
          setHasSubmittedProposal(!!data);
        }
      }
    };

    checkIfSubmitted();
  }, [user, job]);


  if (loading || !job) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error loading job details.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{job.title}</h1>
      <div className="mb-4">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {job.category}
        </span>
         <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {job.event_type}
        </span>
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          {job.experience_level}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Description</h3>
        <p className="text-gray-700">{job.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Budget</h3>
        <p className="text-gray-700">{formatCurrency(job.budget)}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Deadline</h3>
        <p className="text-gray-700">{formatDate(job.deadline)}</p>
      </div>

      {job.milestones && job.milestones.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Milestones</h3>
          <div className="border rounded-md">
            {job.milestones.map((milestone: any) => (
              <div key={milestone.id} className="p-4 border-b last:border-b-0">
                <h4 className="font-semibold text-gray-900">{milestone.title}</h4>
                {milestone.description && (
                  <p className="text-gray-600 mb-2">{milestone.description}</p>
                )}
                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                  <span>Due Date: {formatDate(milestone.due_date)}</span>
                  <span>Payment: {formatCurrency(milestone.payment_amount)}</span>
                  <span>Status: {milestone.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditionally render SubmitProposal component */}
      {user && user.role === 'vendor' && !hasSubmittedProposal && (
        <SubmitProposal jobId={job.id} />
      )}

      {/* Display ProposalList if the user is the client who posted the job */}
      {user && user.role === 'client' && user.id === job.client_id && (
        <ProposalList jobId={job.id} />
      )}
    </div>
  );
}
