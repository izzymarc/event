{/* Import necessary React hooks and components */}
import { Suspense, lazy, memo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';
import { useToast } from './lib/hooks/useToast';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import { ROUTES } from './lib/constants';

// Lazy load components to improve initial load time
const LandingPage = lazy(() => import('./components/landing/LandingPage'));
const SignInForm = lazy(() => import('./components/auth/SignInForm'));
const SignUpForm = lazy(() => import('./components/auth/SignUpForm'));
const ForgotPasswordForm = lazy(() => import('./components/auth/ForgotPasswordForm'));
const ResetPasswordForm = lazy(() => import('./components/auth/ResetPasswordForm'));
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'));
const JobMarketplace = lazy(() => import('./components/jobs/JobMarketplace'));
const CreateJob = lazy(() => import('./components/jobs/CreateJob'));
const ProposalList = lazy(() => import('./components/proposals/ProposalList'));
const MessagingCenter = lazy(() => import('./components/messaging/MessagingCenter'));
const PaymentCenter = lazy(() => import('./components/payments/PaymentCenter'));
const UserProfile = lazy(() => import('./components/profile/UserProfile'));
const Settings = lazy(() => import('./components/settings/Settings'));

// Loading spinner component for lazy loaded components
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

// Private route component to protect routes that require authentication
const PrivateRoute = memo(({ children }: { children: React.ReactNode }) => {
  // Get user and loading state from AuthContext
  const { user, loading } = useAuth();

  // Show loading spinner if auth is still loading
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to sign-in page if user is not authenticated
  if (!user) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  // Render the children if user is authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
});

PrivateRoute.displayName = 'PrivateRoute';

// Public route component to redirect authenticated users from public routes
const PublicRoute = memo(({ children }: { children: React.ReactNode }) => {
  // Get user and loading state from AuthContext
  const { user, loading } = useAuth();

  // Show loading spinner if auth is still loading
  if (loading) {
    return <LoadingSpinner />;
  }

  // Redirect to dashboard if user is authenticated
  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Render the children if user is not authenticated
  return <ErrorBoundary>{children}</ErrorBoundary>;
});

PublicRoute.displayName = 'PublicRoute';

// Main app content component
const AppContent = () => {
  // Get toast functions from useToast hook
  const { toasts, removeToast } = useToast();

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route
            path={ROUTES.SIGN_IN}
            element={
              <PublicRoute>
                <SignInForm />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.SIGN_UP}
            element={
              <PublicRoute>
                <SignUpForm />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.FORGOT_PASSWORD}
            element={
              <PublicRoute>
                <ForgotPasswordForm />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.RESET_PASSWORD}
            element={
              <PublicRoute>
                <ResetPasswordForm />
              </PublicRoute>
            }
          />

          {/* Private Routes */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.JOBS}
            element={
              <PrivateRoute>
                <JobMarketplace />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.CREATE_JOB}
            element={
              <PrivateRoute>
                {/* Role protected route for creating jobs */}
                <RoleProtectedRoute requiredPermission="create:jobs">
                  <CreateJob />
                </RoleProtectedRoute>
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.PROPOSALS}
            element={
              <PrivateRoute>
                <ProposalList />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.MESSAGES}
            element={
              <PrivateRoute>
                <MessagingCenter />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.PAYMENTS}
            element={
              <PrivateRoute>
                <PaymentCenter />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.PROFILE}
            element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          {/* Redirect to home page for any unknown routes */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </Suspense>
      {/* Toast container to display notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </Router>
  );
};

// Main App component that wraps the entire application
export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
