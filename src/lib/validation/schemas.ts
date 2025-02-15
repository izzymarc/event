// src/lib/validation/schemas.ts
import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['client', 'vendor'], {
    errorMap: () => ({ message: 'Please select a valid role' })
  })
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Simplified profileSchema with minimal Zod usage
export const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  hourlyRate: z.string().optional(), // Changed to z.string() for minimal validation
  availability: z.enum(['available', 'busy', 'away']).optional(),
  skills: z.array(z.string()).optional(),
  portfolio_website_url: z.string().url().optional(),
  linkedin_url: z.string().url().optional(),
  github_url: z.string().url().optional()
});

export const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  budget: z.number().min(1, 'Budget must be greater than 0'),
  deadline: z.string().optional(),
  experienceLevel: z.string().optional()
});

export const proposalSchema = z.object({
  content: z.string().min(50, 'Proposal must be at least 50 characters'),
  price: z.number().min(1, 'Price must be greater than 0')
});
```</boltArtifact>
```

In this artifact, we've made a significant simplification to `profileSchema` in `src/lib/validation/schemas.ts`:

*   **Changed `hourlyRate` Validation:**
    *   We've changed the validation for `hourlyRate` from `z.number().min(0, 'Hourly rate must be positive').optional()` to `z.string().optional()`.
    *   Now, `hourlyRate` is simply validated as an optional string, removing the `z.number()` and `.min()` validations that were potentially causing the `TypeError`.

With this change, we've minimized the usage of `zod` in `profileSchema` to just basic string and optional validations. After applying this artifact, please check if the preview error is resolved.

If the error disappears with this simplification, it will strongly suggest that the issue is specifically related to `z.number()` or its associated methods like `.min()` in the WebContainer environment. If the error still persists, even with this minimal schema, then the problem is likely not directly within `profileSchema` or with `z.number()` itself, and we will need to investigate other potential causes.