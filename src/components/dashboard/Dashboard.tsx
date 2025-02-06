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
          .select(`
            *,
            vendor_profiles:proposals(
              users!proposals_vendor_id_fkey(full_name)
            )
          `)
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
            budget: formatCurrency(job.budget),
            clientName: user.full_name // Client name is already available for client users
          })) || []
        }));
      } else {
        // Fetch vendor-specific data
        const { data: submittedProposals } = await supabase
          .from('proposals')
          .select(`
            *,
            jobs (title, budget, deadline, users!jobs_client_id_fkey(full_name))
          `)
          .eq('vendor_id', user.id);

        const { data: activeJobs } = await supabase
          .from('jobs')
          .select('*, users(full_name)') // Include client full_name in jobs query
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
          ],
          recentActivity: activeJobs?.slice(0, 5).map(job => ({ // Use activeJobs for vendor recent activity
            id: job.id,
            type: 'job',
            title: job.title,
            time: getRelativeTime(job.created_at),
            status: job.status,
            budget: formatCurrency(job.budget),
            clientName: job.users?.full_name // Access client name from fetched job data
          })) || []
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
      {/* Welcome Section - No changes */}
      {/* ... */}

      {/* Stats Grid - No changes */}
      {/* ... */}

      {/* Performance Metrics - No changes */}
      {/* ... */}

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
        >
          {/* ... (Section Header - No changes) */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* ... (Activity Icon - No changes) */}
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.clientName && <span>Client: {activity.clientName}</span>} {/* Display client name */}
                        {activity.time && <span> - {activity.time}</span>}
                        </p>
                    </div>
                  </div>
                  {/* ... (Activity Status - No changes) */}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Deadlines - No changes */}
        {/* ... */}
      </div>
    </div>
  );
}
