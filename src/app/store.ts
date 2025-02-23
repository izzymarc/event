import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from '../features/jobs/jobsSlice.ts';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
