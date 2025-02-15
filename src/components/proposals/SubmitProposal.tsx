import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProposalActions } from '../../lib/hooks/useProposalActions';
import { useToast } from '../../lib/hooks/useToast';
import { motion } from 'framer-motion';
import { FileText, DollarSign, Send, Paperclip } from 'lucide-react';
import { usePortfolio } from '../../lib/hooks/usePortfolio';
import { LoadingPage } from '../ui/LoadingSpinner';

interface SubmitProposalProps {
  jobId: string;
}

export default function SubmitProposal({ jobId }: SubmitProposalProps) {
  const { user } = useAuth();
  const { createProposal } = useProposalActions();
  const { addToast } = useToast();
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const { items: portfolioItems, loading: portfolioLoading } = usePortfolio(user?.id || '');
  const [selectedPortfolioItems, setSelectedPortfolioItems] = useState<string[]>([]); // State for selected portfolio items

  useEffect(() => {
    if (!user?.id) return;
    // Portfolio items are already being fetched by usePortfolio hook
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      addToast('You must be logged in to submit a proposal.', 'error');
      setLoading(false);
      return;
    }

    if (!jobId) {
      addToast('Invalid job ID.', 'error');
      setLoading(false);
      return;
    }

    try {
      const proposalData = {
        job_id: jobId,
        vendor_id: user.id,
        content,
        price: parseFloat(price),
        cover_letter: coverLetter,
        status: 'pending',
        portfolio_item_ids: selectedPortfolioItems, // Include selected portfolio item IDs
      };

      const success = await createProposal(proposalData);

      if (success) {
        addToast('Proposal submitted successfully!', 'success');
        setContent('');
        setPrice('');
        setCoverLetter('');
        setSelectedPortfolioItems([]); // Clear selected portfolio items after submission
      }
    } catch (error: any) {
      addToast(error.message || 'Failed to submit proposal.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'vendor') {
    return null;
  }

  if (portfolioLoading) {
    return <LoadingPage />;
  }

  const handlePortfolioItemSelection = (itemId: string) => {
    setSelectedPortfolioItems(prevItems => {
      if (prevItems.includes(itemId)) {
        return prevItems.filter(id => id !== itemId); // Deselect if already selected
      } else {
        return [...prevItems, itemId]; // Select if not already selected
      }
    });
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Submit a Proposal</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <div className="mt-1 relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Write a cover letter to introduce yourself and explain why you are a good fit for this job..."
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Proposal Details
          </label>
          <div className="mt-1 relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Provide specific details about your proposal and how you plan to approach this job..."
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Proposed Price
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., 1000"
              required
              min="1"
            />
          </div>
        </div>

        {/* Portfolio Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Portfolio Items (Optional)
          </label>
          {portfolioLoading ? (
            <div>Loading portfolio...</div>
          ) : (
            <ul className="mt-2 space-y-2">
              {portfolioItems.map(item => (
                <li key={item.id} className="flex items-center">
                  <input
                    id={`portfolio-item-${item.id}`}
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    value={item.id}
                    checked={selectedPortfolioItems.includes(item.id)}
                    onChange={() => handlePortfolioItemSelection(item.id)}
                  />
                  <label htmlFor={`portfolio-item-${item.id}`} className="ml-3 block text-sm text-gray-700">
                    {item.title}
                  </label>
                </li>
              ))}
              {portfolioItems.length === 0 && (
                <li className="text-gray-500">No portfolio items available. Add some in your profile settings.</li>
              )}
            </ul>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Proposal
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
}
