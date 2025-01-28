import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { supabase } from './lib/supabase';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

// Function to test the database connection
async function testDatabaseConnection() {
  try {
    console.log('Testing database connection...');
    const { data, error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.error('Database connection test failed:', error);
    } else {
      console.log('Database connection test successful. Retrieved user:', data);
    }
  } catch (error) {
    console.error('Error during database connection test:', error);
  }
}

// Wrap in try-catch to handle any initialization errors
try {
  testDatabaseConnection(); // Test the database connection
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-gray-600">Please try refreshing the page</p>
      </div>
    </div>
  );
}
