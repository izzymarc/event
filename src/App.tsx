import React from 'react';
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
import { ROUTES } from './lib/constants';
import { LoadingPage } from './components/ui/LoadingSpinner';
import EventWorkDashboard from './components/eventworkDashboard/EventWorkDashboard'; // Import EventWorkDashboard

// Lazy load components
const LandingPage = lazy(() => import('./components/landing/LandingPage'));
const SignInForm = lazy(() => import('./components/auth/SignInForm'));
const SignUpForm = lazy(() => import('./components/auth/SignUpForm'));
const ForgotPasswordForm = lazy(() => import('./components/auth/ForgotPasswordForm'));
const ResetPasswordForm = lazy(() => import('./components/auth/ResetPasswordForm'));
const AboutPage = lazy(() => import('./components/landing/AboutPage')); // Lazy load AboutPage
const ContactPage = lazy(() => import('./components/landing/ContactPage')); // Lazy load ContactPage
const PricingPage = lazy(() => import('./components/landing/PricingPage')); // Lazy load PricingPage
const TermsPage = lazy(() => import('./components/landing/TermsPage')); // Lazy load TermsPage
const PrivacyPolicyPage = lazy(() => import('./components/landing/PrivacyPolicyPage')); // Lazy load PrivacyPolicyPage
const HelpPage = lazy(() => import('./components/landing/HelpPage')); // Lazy load HelpPage
const FAQPage = lazy(() => import('./components/landing/FAQPage')); // Lazy load FAQPage
const SitemapPage = lazy(() => import('./components/landing/SitemapPage')); // Lazy load SitemapPage
const FeedbackPage = lazy(() => import('./components/landing/FeedbackPage')); // Lazy load FeedbackPage
const ProfessionalsPage = lazy(() => import('./components/landing/ProfessionalsPage')); // Lazy load ProfessionalsPage
const ProfessionalsFindJobsPage = lazy(() => import('./components/landing/ProfessionalsFindJobsPage')); // Lazy load ProfessionalsFindJobsPage
const ProfessionalsCreateProfilePage = lazy(() => import('./components/landing/ProfessionalsCreateProfilePage')); // Lazy load ProfessionalsCreateProfilePage
const ProfessionalsPricingPage = lazy(() => import('./components/landing/ProfessionalsPricingPage')); // Lazy load ProfessionalsPricingPage
const ProfessionalsResourcesPage = lazy(() => import('./components/landing/ProfessionalsResourcesPage')); // Lazy load ProfessionalsResourcesPage

// const Dashboard = lazy(() => import('./components/dashboard/Dashboard')); // Comment out original Dashboard import
const JobMarketplace = lazy(() => import('./components/jobs/JobMarketplace'));
const JobDetailsPage = lazy(() => import('./components/jobs/JobDetailsPage'));
const ProposalList = lazy(() => import('./components/proposals/ProposalList'));
const MessagingCenter = lazy(() => import('./components/messaging/MessagingCenter'));
const PaymentCenter = lazy(() => import('./components/payments/PaymentCenter'));
const UserProfile = lazy(() => import('./components/profile/UserProfile'));
const Settings = lazy(() => import('./components/settings/Settings'));

const PrivateRoute: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex">
        <main className="flex-1 p-6 overflow-auto relative z-10">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
});

PrivateRoute.displayName = 'PrivateRoute';

const PublicRoute: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingPage />;
  }

  if (user) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <ErrorBoundary>{children}</ErrorBoundary>
  );
});

PublicRoute.displayName = 'PublicRoute';

export default function App() {
  const { toasts, removeToast } = useToast();

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<LoadingPage />}>
              <Routes>
                <Route path={ROUTES.HOME} element={<LandingPage />} />
                <Route path="/about" element={<AboutPage />} /> {/* About page route */}
                <Route path="/contact" element={<ContactPage />} /> {/* Contact page route */}
                <Route path="/pricing" element={<PricingPage />} /> {/* Pricing page route */}
                <Route path="/terms" element={<TermsPage />} /> {/* Terms page route */}
                <Route path="/privacy" element={<PrivacyPolicyPage />} /> {/* Privacy Policy page route */}
                <Route path="/help" element={<HelpPage />} /> {/* Help page route */}
                <Route path="/faq" element={<FAQPage />} /> {/* FAQ page route */}
                <Route path="/sitemap" element={<SitemapPage />} /> {/* Sitemap page route */}
                <Route path="/feedback" element={<FeedbackPage />} /> {/* Feedback page route */}
                <Route path="/professionals" element={<ProfessionalsPage />} /> {/* Professionals page route */}
                <Route path="/professionals/find-jobs" element={<ProfessionalsFindJobsPage />} /> {/* Professionals Find Jobs page route */}
                <Route path="/professionals/create-profile" element={<ProfessionalsCreateProfilePage />} /> {/* Professionals Create Profile page route */}
                <Route path="/professionals/pricing" element={<ProfessionalsPricingPage />} /> {/* Professionals Pricing page route */}
                <Route path="/professionals/resources" element={<ProfessionalsResourcesPage />} /> {/* Professionals Resources page route */}
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
                <Route
                  path={ROUTES.DASHBOARD}
                  element={
                    <PrivateRoute>
                      <EventWorkDashboard /> {/* Use EventWorkDashboard here */}
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
                  path="/jobs/:jobId"
                  element={
                    <PrivateRoute>
                      <JobDetailsPage />
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
                <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
              </Routes>
            </Suspense>
            <ToastContainer toasts={toasts} onClose={removeToast} />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
