import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, Calendar, FileText, Plus, Minus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../../lib/hooks/useToast';
import { useAuth } from '../../contexts/AuthContext';
import { SERVICE_CATEGORIES, EVENT_TYPES } from '../../lib/constants';

interface Milestone {
  id: string; // Temporary ID for UI purposes
  title: string;
  description: string;
  dueDate: string;
  paymentAmount: string;
}

export default function CreateJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    event_type: '', // Added event_type
    budget: '',
    deadline: '',
    experienceLevel: 'intermediate',
    skills: [] as string[]
  });
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare job data
      const jobData = {
        client_id: user?.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        event_type: formData.event_type, // Include event_type
        budget: parseFloat(formData.budget),
        deadline: formData.deadline,
        experience_level: formData.experienceLevel,
        status: 'open',
        is_visible: true
      };

      // Insert job and then milestones
      const { data: jobInsertResult, error: jobError } = await supabase
        .from('jobs')
        .insert([jobData])
        .select('id') // Select job ID to associate with milestones
        .single();

      if (jobError) throw jobError;

      const jobId = jobInsertResult.id;

      // Prepare milestones data, converting paymentAmount to a number
      const milestonesData = milestones.map(milestone => ({
        job_id: jobId, // Associate with the newly created job
        title: milestone.title,
        description: milestone.description,
        due_date: milestone.dueDate,
        payment_amount: parseFloat(milestone.paymentAmount) // Convert to number
      }));

      // Insert milestones
      if (milestonesData.length > 0) {
        const { error: milestonesError } = await supabase
          .from('milestones')
          .insert(milestonesData);

        if (milestonesError) throw milestonesError;
      }

      addToast('Job posted successfully!', 'success');
      navigate('/jobs');

    } catch (error: any) {
      console.error('Error creating job:', error);
      addToast(error.message || 'Failed to create job', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneChange = (index: number, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    const updatedMilestones = [...milestones];
    updatedMilestones[index] = { ...updatedMilestones[index], [name]: value };
    setMilestones(updatedMilestones);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now().toString(), title: '', description: '', dueDate: '', paymentAmount: '' }]);
  };

  const removeMilestone = (index: number) => {
    const updatedMilestones = milestones.filter((_, i) => i !== index);
    setMilestones(updatedMilestones);
  };


  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
        <p className="mt-1 text-gray-500">
          Fill in the details below to post your job and find the perfect professional.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., Website Redesign Project"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <div className="mt-1 relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Describe your project requirements..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              {SERVICE_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
              Event Type
            </label>
            <select
              id="event_type"
              name="event_type"
              required
              value={formData.event_type}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select event type</option>
              {EVENT_TYPES.map(eventType => (
                <option key={eventType.id} value={eventType.id}>
                  {eventType.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="budget"
                name="budget"
                required
                min="1"
                value={formData.budget}
                onChange={handleChange}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="1000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                id="deadline"
                name="deadline"
                required
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
              Required Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Milestones Section */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Milestones</h2>
            <motion.button
              type="button"
              onClick={addMilestone}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </motion.button>
          </div>

          {milestones.map((milestone, index) => (
            <motion.div key={milestone.id} className="mb-6 p-4 border rounded-md" layout>
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Milestone {index + 1}</h3>
                <button
                  onClick={() => removeMilestone(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor={`milestoneTitle-${index}`} className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    id={`milestoneTitle-${index}`}
                    name="title"
                    value={milestone.title}
                    onChange={(e) => handleMilestoneChange(index, e)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor={`milestoneDescription-${index}`} className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    id={`milestoneDescription-${index}`}
                    name="description"
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, e)}
                    rows={2}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={`milestoneDueDate-${index}`} className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="date"
                      id={`milestoneDueDate-${index}`}
                      name="dueDate"
                      value={milestone.dueDate}
                      onChange={(e) => handleMilestoneChange(index, e)}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor={`milestonePaymentAmount-${index}`} className="block text-sm font-medium text-gray-700">Payment Amount</label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id={`milestonePaymentAmount-${index}`}
                        name="paymentAmount"
                        value={milestone.paymentAmount}
                        onChange={(e) => handleMilestoneChange(index, e)}
                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Amount"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/jobs')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </motion.button>
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
                Posting...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Post Job
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
