import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, Calendar, FileText, Plus, List, Minus } from 'lucide-react';
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
    event_type: '',
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
      // Prepare job data (same as before)
      const jobData = {
        client_id: user?.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        event_type: formData.event_type,
        budget: parseFloat(formData.budget),
        deadline: formData.deadline,
        experience_level: formData.experienceLevel,
        status: 'open',
        is_visible: true
      };

      // Prepare milestones data (same as before, but map to correct format for DB)
      const milestonesData = milestones.map(milestone => ({
        title: milestone.title,
        description: milestone.description,
        due_date: milestone.dueDate,
        payment_amount: parseFloat(milestone.paymentAmount)
      }));


      // Insert job and then milestones
      const { data: jobInsertResult, error: jobError } = await supabase
        .from('jobs')
        .insert([jobData])
        .select('id') // Select job ID to associate with milestones
        .single();

      if (jobError) throw jobError;

      const jobId = jobInsertResult.id;

      // Insert milestones, associate with job ID
      if (milestonesData.length > 0) {
        const milestonesInsertData = milestonesData.map(milestone => ({
          ...milestone,
          job_id: jobId // Add job_id to each milestone
        }));

        const { error: milestonesError } = await supabase
          .from('milestones')
          .insert(milestonesInsertData);

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
      {/* ... (rest of the component - no changes) */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* ... (form fields) */}

        {/* Milestones Section */}
        {/* ... */}


        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          {/* ... */}
        </div>
      </form>
    </div>
  );
}
