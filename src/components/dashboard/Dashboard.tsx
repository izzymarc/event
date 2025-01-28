import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Briefcase,
  FileText,
  MessageSquare,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Filter,
  Sun,
  Users,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Star,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [] as any[],
    recentActivity: [] as any[],
    upcomingDeadlines: [] as any[]
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    try {
      if (user?.role === 'client') {
        // Fetch client-specific data
        const { data: postedJobs } = await supabase
          .from('jobs')
          .select('*')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });

        const { data: proposals } = await supabase
          .from('proposals')
          .select(`
            *,
            jobs (title),
            users (full_name)
          `)
          .eq('jobs.client_id', user.id);

        setDashboardData({
          stats: [
            {
              name: 'Active Projects',
              value: postedJobs?.filter(job => job.status === 'active').length || 0,
              icon: Briefcase,
              change: '+2.5%',
              changeType: 'increase',
              color: 'bg-blue-500'
            },
            {
              name: 'Total Proposals',
              value: proposals?.length || 0,
              icon: FileText,
              change: '+18.3%',
              changeType: 'increase',
              color: 'bg-purple-500'
            },
            {
              name: 'Hired Vendors',
              value: proposals?.filter(p => p.status === 'accepted').length || 0,
              icon: Users,
              change: '+12.5%',
              changeType: 'increase',
              color: 'bg-green-500'
            },
            {
              name: 'Total Spent',
              value: `$${proposals?.reduce((acc, p) => acc + (p.status === 'completed' ? p.price : 0), 0) || 0}`,
              icon: CreditCard,
              change: '+4.1%',
              changeType: 'increase',
              color: 'bg-indigo-500'
            }
          ],
          recentActivity: postedJobs?.slice(0, 5).map(job => ({
            id: job.id,
            type: 'job',
            title: job.title,
            time: new Date(job.created_at).toLocaleDateString(),
            status: job.status,
            budget: `$${job.budget}`
          })) || [],
          upcomingDeadlines: postedJobs?.filter(job => job.deadline)
            .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
            .slice(0, 3)
            .map(job => ({
              id: job.id,
              project: job.title,
              deadline: job.deadline,
              status: job.status,
              priority: job.priority || 'medium'
            })) || []
        });
      } else {
        // Fetch vendor-specific data
        const { data: submittedProposals } = await supabase
          .from('proposals')
          .select(`
            *,
            jobs (title, budget, deadline)
          `)
          .eq('vendor_id', user.id);

        const { data: activeJobs } = await supabase
          .from('jobs')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        setDashboardData({
          stats: [
            {
              name: 'Available Jobs',
              value: activeJobs?.length || 0,
              icon: Briefcase,
              change: '+5.2%',
              changeType: 'increase',
              color: 'bg-blue-500'
            },
            {
              name: 'Submitted Proposals',
              value: submittedProposals?.length || 0,
              icon: FileText,
              change: '+8.1%',
              changeType: 'increase',
              color: 'bg-purple-500'
            },
            {
              name: 'Success Rate',
              value: `${Math.round((submittedProposals?.filter(p => p.status === 'accepted').length || 0) / (submittedProposals?.length || 1) * 100)}%`,
              icon: CheckCircle,
              change: '+15.3%',
              changeType: 'increase',
              color: 'bg-green-500'
            },
            {
              name: 'Total Earnings',
              value: `$${submittedProposals?.reduce((acc, p) => acc + (p.status === 'completed' ? p.price : 0), 0) || 0}`,
              icon: CreditCard,
              change: '+12.4%',
              changeType: 'increase',
              color: 'bg-indigo-500'
            }
          ],
          recentActivity: submittedProposals?.slice(0, 5).map(proposal => ({
            id: proposal.id,
            type: 'proposal',
            title: proposal.jobs?.title,
            time: new Date(proposal.created_at).toLocaleDateString(),
            status: proposal.status,
            amount: `$${proposal.price}`
          })) || [],
          upcomingDeadlines: submittedProposals?.filter(p => p.jobs?.deadline && p.status === 'accepted')
            .sort((a, b) => new Date(a.jobs.deadline).getTime() - new Date(b.jobs.deadline).getTime())
            .slice(0, 3)
            .map(proposal => ({
              id: proposal.id,
              project: proposal.jobs.title,
              deadline: proposal.jobs.deadline,
              status: proposal.status,
              priority: 'high'
            })) || []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  // Get time of day for personalized greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get role-specific welcome message
  const getWelcomeMessage = () => {
    if (!user?.role) return 'Welcome to your dashboard';
    
    const messages = {
      client: [
        "Ready to find the perfect talent for your projects?",
        "Your project dashboard awaits your attention",
        "Let's make your projects come to life"
      ],
      vendor: [
        "New opportunities are waiting for you",
        "Check out the latest projects that match your skills",
        "Ready to showcase your expertise?"
      ]
    };

    const roleMessages = messages[user.role] || messages.client;
    return roleMessages[Math.floor(Math.random() * roleMessages.length)];
  };

  // Get the first name from the full name
  const firstName = user?.full_name?.split(' ')[0] || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Enhanced Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3">
          <Sun className="h-8 w-8 text-yellow-500" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getTimeBasedGreeting()}, {firstName}!
            </h1>
            <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
              {getWelcomeMessage()}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
            {user?.role === 'client' ? 'Project Owner' : 'Service Provider'}
          </span>
          <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4 mr-1" />
            Last login: Today at {new Date().toLocaleTimeString()}
          </span>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {user?.role === 'client' ? (
            <>
              <Link
                to="/jobs/new"
                className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Briefcase className="h-5 w-5" />
                <span>Post New Job</span>
              </Link>
              <Link
                to="/proposals"
                className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-700"
              >
                <FileText className="h-5 w-5" />
                <span>View Proposals</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/jobs"
                className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Briefcase className="h-5 w-5" />
                <span>Find Jobs</span>
              </Link>
              <Link
                to="/profile"
                className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-700"
              >
                <Star className="h-5 w-5" />
                <span>Update Portfolio</span>
              </Link>
            </>
          )}
          <Link
            to="/messages"
            className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-700"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </Link>
          <Link
            to="/payments"
            className="p-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-700"
          >
            <DollarSign className="h-5 w-5" />
            <span>{user?.role === 'client' ? 'Manage Payments' : 'View Earnings'}</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {dashboardData.stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg transition-shadow hover:shadow-md"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                          {stat.value}
                        </div>
                        <div
                          className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase'
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {stat.changeType === 'increase' ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {stat.change}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h2>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="day">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Filter className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'job' 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                        : activity.type === 'message'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200'
                        : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {activity.type === 'job' ? (
                        <Briefcase className="h-5 w-5" />
                      ) : activity.type === 'message' ? (
                        <MessageSquare className="h-5 w-5" />
                      ) : (
                        <CreditCard className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.client}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.amount}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {activity.time}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : activity.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Deadlines</h2>
              <button className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboardData.upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {deadline.project}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deadline.priority === 'high'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {deadline.priority} Priority
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        deadline.status === 'in_progress'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                      }`}>
                        {deadline.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(deadline.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
