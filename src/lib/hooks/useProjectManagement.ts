import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

interface Milestone {
  id: string;
  title: string;
  description: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed';
  amount: number;
}

interface TimeEntry {
  id: string;
  description: string;
  start_time: string;
  end_time: string;
  duration: number;
}

export function useProjectManagement(projectId: string) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMilestones = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addMilestone = useCallback(async (milestone: Omit<Milestone, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert([{ ...milestone, project_id: projectId }])
        .select()
        .single();

      if (error) throw error;
      setMilestones(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding milestone:', error);
      throw error;
    }
  }, [projectId]);

  const updateMilestoneStatus = useCallback(async (id: string, status: Milestone['status']) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .update({ status })
        .eq('id', id)
        .eq('project_id', projectId)
        .select()
        .single();

      if (error) throw error;
      setMilestones(prev => prev.map(m => m.id === id ? data : m));
      return data;
    } catch (error) {
      console.error('Error updating milestone:', error);
      throw error;
    }
  }, [projectId]);

  const addTimeEntry = useCallback(async (entry: Omit<TimeEntry, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('time_entries')
        .insert([{ ...entry, project_id: projectId }])
        .select()
        .single();

      if (error) throw error;
      setTimeEntries(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding time entry:', error);
      throw error;
    }
  }, [projectId]);

  const fetchTimeEntries = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('time_entries')
        .select('*')
        .eq('project_id', projectId)
        .order('start_time', { ascending: false });

      if (error) throw error;
      setTimeEntries(data || []);
    } catch (error) {
      console.error('Error fetching time entries:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    milestones,
    timeEntries,
    loading,
    fetchMilestones,
    addMilestone,
    updateMilestoneStatus,
    addTimeEntry,
    fetchTimeEntries
  };
}
