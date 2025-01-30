import { useState, useCallback } from 'react';
import { supabase } from '../supabase';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  projectUrl?: string;
  technologies: string[];
  created_at: string;
}

export function usePortfolio(userId: string) {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addItem = useCallback(async (item: Omit<PortfolioItem, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([{ ...item, user_id: userId }])
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  }, [userId]);

  const updateItem = useCallback(async (id: string, updates: Partial<PortfolioItem>) => {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setItems(prev => prev.map(item => item.id === id ? data : item));
      return data;
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      throw error;
    }
  }, [userId]);

  const deleteItem = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      throw error;
    }
  }, [userId]);

  return {
    items,
    loading,
    fetchPortfolio,
    addItem,
    updateItem,
    deleteItem
  };
}
