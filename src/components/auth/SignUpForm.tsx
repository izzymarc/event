import { useState, ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserPlus, Mail, Lock, User, Briefcase, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../lib/constants';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'client' | 'vendor'>('client');
  const [error, setError] = useState<ReactNode>('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await signUp(email, password, role, fullName);
    } catch (err: any) {
      if (err.code === 'user_already_exists') {
        setError(
          <span>
            An account with this email already exists.{' '}
            <Link to="/signin" className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
              Sign in instead
            </Link>
          </span>
        );
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <Link
        to={ROUTES.HOME}
        className="absolute top-4 left-4 p-2 flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>


      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-white dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center mb-4"
            >
              <UserPlus className="h-6 w-6 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join our community of event professionals
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 p-4 rounded-md"
              >
                <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
              </motion.div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="full-name"
                    name="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 transition-colors duration-200"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 transition-colors duration-200"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 transition-colors duration-200"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  I want to
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'client' | 'vendor')}
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-800 transition-colors duration-200"
                  >
                    <option value="client">Hire Event Professionals</option>
                    <option value="vendor">Offer Event Services</option>
                  </select>
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <UserPlus className="h-5 w-5 text-indigo-300 group-hover:text-indigo-200" />
              </span>
              {loading ? 'Creating account...' : 'Create account'}
            </motion.button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors inline-flex items-center"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>

      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1505236858219-8359eb29e329?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 to-indigo-900/90 mix-blend-multiply" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-xl text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Start your journey with EventWork
              </h2>
              <p className="text-xl text-purple-100">
                Whether you're planning events or offering services, we've got you covered
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
