import React from 'react';
import { useParams } from 'react-router-dom';
import { useJob } from '../../lib/hooks/useJob';
import { LoadingPage } from '../ui/LoadingSpinner';
import { formatCurrency, formatDate } from '../../lib/utils';

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const { job, loading, error } = useJob(jobId || ''); // jobId can be undefined

  if (loading || !job) {
    return <LoadingPage />;
  }

  if (error) {
    return <div>Error loading job details.</div>; // Basic error handling for now
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
          <ul>
            {job.milestones.map((milestone: any) => (
              <li key={milestone.id} className="py-2">
                <h4 className="font-semibold">{milestone.title}</h4>
                <p className="text-gray-600">{milestone.description}</p>
                <p className="text-sm text-gray-500">Due Date: {formatDate(milestone.due_date)}</p>
                <p className="text-sm text-gray-500">Payment: {formatCurrency(milestone.payment_amount)}</p>
                <p className="text-sm text-gray-500">Status: {milestone.status}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add more job details here as needed */}
    </div>
  );
}
