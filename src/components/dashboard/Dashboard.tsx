import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, CreditCard, TrendingUp, TrendingDown, Clock, Calendar, Filter, Sun, Users, CheckCircle, AlertCircle, DollarSign, Star, Award, BarChart as ChartBar, Activity, Target, BarChart2, PieChart, ArrowUpRight, Zap, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getRelativeTime } from '../../lib/utils';

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: [] as any[],
    recentActivity: [] as any[],
    upcomingDeadlines: [] as any[],
    performanceMetrics: {
      completionRate: 92,
      responseTime: '2.5h',
      clientSatisfaction: 4.8,
      activeProjects: 5
    },
    earnings: {
      total: 12500,
      thisMonth: 2800,
      pending: 1500,
      projected: 3500
    }
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

        setDashboardData(prev => ({
          ...prev,
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
              value: formatCurrency(proposals?.reduce((acc, p) => acc + (p.status === 'completed' ? p.price : 0), 0) || 0),
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
            time: getRelativeTime(job.created_at),
            status: job.status,
            budget: formatCurrency(job.budget)
          })) || []
        }));
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

        setDashboardData(prev => ({
          ...prev,
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
              name: 'Success Rate',
              value: `${Math.round((submittedProposals?.filter(p => p.status === 'accepted').length || 0) / (submittedProposals?.length || 1) * 100)}%`,
              icon: Target,
              change: '+15.3%',
              changeType: 'increase',
              color: 'bg-green-500'
            },
            {
              name: 'Response Rate',
              value: '94%',
              icon: Zap,
              change: '+8.1%',
              changeType: 'increase',
              color: 'bg-purple-500'
            },
            {
              name: 'Global Rank',
              value: '#128',
              icon: Globe,
              change: '+12.4%',
              changeType: 'increase',
              color: 'bg-indigo-500'
            }
          ]
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.full_name?.split(' ')[0]}!
          </h1>
          <p className="text-indigo-100 text-lg">
            {user?.role === 'client' 
              ? "Here's what's happening with your projects today"
              : "Here's your professional overview for today"}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to={user?.role === 'client' ? '/jobs/new' : '/jobs'}
              className="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              {user?.role === 'client' ? 'Post New Job' : 'Find Jobs'}
            </Link>
            <Link
              to="/messages"
              className="inline-flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Messages
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {dashboardData.stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-lg p-3 ${stat.color} bg-opacity-10`}>
                    <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
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

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Overview</h2>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Placeholder for chart - You would integrate your preferred charting library here */}
            <BarChart2 className="h-32 w-32" />
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Key Metrics</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                  <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dashboardData.performanceMetrics.completionRate}%
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-500" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response Time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dashboardData.performanceMetrics.responseTime}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-500" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Client Satisfaction</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {dashboardData.performanceMetrics.clientSatisfaction}/5.0
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'job' 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                      {activity.type === 'job' ? (
                        <Briefcase className="h-5 w-5" />
                      ) : (
                        <MessageSquare className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'completed'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</h2>
              <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                View Calendar
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
                      {formatDate(deadline.deadline)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
