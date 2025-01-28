import { z } from 'zod';

export const jobSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  category: z.string().min(1, 'Please select a category'),
  budget: z.number()
    .min(1, 'Budget must be greater than 0')
    .max(1000000, 'Budget must be less than 1,000,000'),
  deadline: z.string().min(1, 'Please select a deadline'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'expert']),
  skills: z.array(z.string()).optional()
});

export const proposalSchema = z.object({
  content: z.string()
    .min(50, 'Proposal must be at least 50 characters')
    .max(2000, 'Proposal must be less than 2000 characters'),
  price: z.number()
    .min(1, 'Price must be greater than 0')
    .max(1000000, 'Price must be less than 1,000,000'),
  estimatedDuration: z.number()
    .min(1, 'Duration must be at least 1 day')
    .max(365, 'Duration must be less than 365 days'),
  coverLetter: z.string()
    .min(100, 'Cover letter must be at least 100 characters')
    .max(1000, 'Cover letter must be less than 1000 characters')
});
