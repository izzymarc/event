// supabase_functions/utils.js
export function handleApiError(error, res) {
  console.error('API Error:', error);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (error.message) {
    message = error.message;
  }

  res.status(statusCode).json({ error: message });
}

// Add more utility functions as needed (e.g., authentication middleware)
