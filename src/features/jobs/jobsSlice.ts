import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../lib/supabase';
import { JobType } from '../../lib/types';

interface JobsState {
  jobs: JobType[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  loading: 'idle',
  error: null,
};

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const { data } = await supabase.from('jobs').select(`
          *,
          client:users(full_name, rating),
          milestones(*)
        `);
  return data as JobType[];
});

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<JobType[]>) => {
        state.loading = 'succeeded';
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch jobs';
      });
  },
});

export default jobsSlice.reducer;
