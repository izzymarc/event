import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { useDebounce } from './useDebounce';

interface SearchFilters {
  category?: string;
  experienceLevel?: string;
  budgetMin?: number;
  budgetMax?: number;
  skills?: string[];
  location?: string;
  availability?: string;
}

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const search = useCallback(async (
    type: 'jobs' | 'users' | 'proposals',
    page = 1,
    limit = 10
  ) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from(type)
        .select('*', { count: 'exact' });

      // Full-text search if search term exists
      if (debouncedSearchTerm) {
        query = query.textSearch(
          'search_vector',
          debouncedSearchTerm,
          { config: 'english' }
        );
      }

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.experienceLevel) {
        query = query.eq('experience_level', filters.experienceLevel);
      }
      if (filters.budgetMin) {
        query = query.gte('budget', filters.budgetMin);
      }
      if (filters.budgetMax) {
        query = query.lte('budget', filters.budgetMax);
      }
      if (filters.skills?.length) {
        query = query.contains('skills', filters.skills);
      }
      if (filters.location) {
        query = query.eq('location', filters.location);
      }
      if (filters.availability) {
        query = query.eq('availability', filters.availability);
      }

      // Pagination
      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      setResults(data || []);
      if (count !== null) setTotalCount(count);
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, filters]);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    loading,
    results,
    totalCount,
    search
  };
}
