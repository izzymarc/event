{/* Import necessary React components and CSS */}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element where the React app will be rendered
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create a root for React 18
const root = createRoot(rootElement);

// Wrap in try-catch to handle any initialization errors
try {
  // Render the main App component
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  // Log the error and render a fallback UI if rendering fails
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
