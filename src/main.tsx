{/* Import necessary React components and styles */}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element where the React app will be rendered
const rootElement = document.getElementById('root');
// Throw an error if the root element is not found
if (!rootElement) throw new Error('Failed to find the root element');

// Create a root for the React app
const root = createRoot(rootElement);

// Wrap the app rendering in a try-catch block to handle any initialization errors
try {
  // Render the app in strict mode
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  // Log the error if rendering fails
  console.error('Failed to render app:', error);
  // Render a fallback UI if rendering fails
  root.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-gray-900">Something went wrong</h1>
        <p className="mt-2 text-gray-600">Please try refreshing the page</p>
      </div>
    </div>
  );
}
