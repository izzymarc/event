import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Briefcase, FileText, MessageSquare, CreditCard, TrendingUp, TrendingDown, Clock, Calendar, Users, CheckCircle, AlertCircle, DollarSign, Star, Award, Activity as ChartBar, Activity, Target, Globe, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate, getRelativeTime } from '../../lib/utils';
import { DashboardWelcome } from './DashboardWelcome';
import { StatsGrid } from './StatsGrid';
import { PerformanceChart } from './PerformanceChart';
import { KeyMetrics } from './KeyMetrics';
import { RecentActivity } from './RecentActivity';
import { UpcomingDeadlines } from './UpcomingDeadlines';
import { LoadingPage } from '../ui/LoadingSpinner';

// Define interfaces for data structures
interface Stat {
  name: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  changeType: 'increase' | 'decrease';
  color: string;
}

interface ActivityItem {
  id: string;
  type: 'job' | 'proposal' | 'message' | 'deadline'; // Add more types as needed
  title: string;
  time: string;
  status?: string;
  budget?: string;
  clientName?: string; // Client name for vendor dashboard
  vendorName?: string; // Vendor name for client dashboard
}

interface DeadlineItem {
  id: string;
  project: string;
  priority: 'high' | 'medium' | 'low';
  status: 'in_progress' | 'pending' | 'overdue';
  deadline: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    stats: Stat[];
    recentActivity: ActivityItem[];
    upcomingDeadlines: DeadlineItem[]; // Use the new interface
    performanceMetrics: {
      completionRate: number;
      responseTime: string;
      clientSatisfaction: number;
      activeProjects: number;
    };
    earnings: {
      total: number;
      thisMonth: number;
      pending: number;
      projected: number;
    };
  }>({
    stats: [],
    recentActivity: [],
    upcomingDeadlines: [], // Initialize as empty array
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
        const { data: postedJobs, error: postedJobsError } = await supabase
          .from('jobs')
          .select(`
            *,
            proposals(
              count,
              vendor:users!proposals_vendor_id_fkey(full_name)
            )
          `)
          .eq('client_id', user.id)
          .order('created_at', { ascending: false });
        if (postedJobsError) throw postedJobsError;


        const { data: proposals, error: proposalsError } = await supabase
          .from('proposals')
          .select(`
            *,
            jobs (title),
            vendor:users!proposals_vendor_id_fkey(full_name)
          `)
          .eq('jobs.client_id', user.id);

          if(proposalsError) throw proposalsError;

        const recentActivity: ActivityItem[] = [];

        // Add recent job postings
        postedJobs?.slice(0, 3).forEach(job => {
          recentActivity.push({
            id: job.id,
            type: 'job',
            title: `New job posted: ${job.title}`,
            time: getRelativeTime(job.created_at),
            status: job.status,
            budget: formatCurrency(job.budget),
          });
        });

        // Add recent proposals
        proposals?.slice(0, 3).forEach(proposal => {
          recentActivity.push({
            id: proposal.id,
            type: 'proposal',
            title: `New proposal for ${proposal.jobs?.title} from ${proposal.vendor?.full_name}`,
            time: getRelativeTime(proposal.created_at),
            vendorName: proposal.vendor?.full_name,
          });
        });

        // Sort recent activity by time (most recent first)
        recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());


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
              value: proposals?.length || 0, // Use proposals data
              icon: FileText,
              change: '+18.3%',
              changeType: 'increase',
              color: 'bg-purple-500'
            },
            {
              name: 'Hired Vendors',
              value: proposals?.filter(p => p.status === 'accepted').length || 0, // Use proposals data
              icon: Users,
              change: '+12.5%',
              changeType: 'increase',
              color: 'bg-green-500'
            },
            {
              name: 'Total Spent',
              value: formatCurrency(proposals?.reduce((acc, p) => acc + (p.status === 'completed' ? p.price : 0), 0) || 0), // Use proposals data
              icon: CreditCard,
              change: '+4.1%',
              changeType: 'increase',
              color: 'bg-indigo-500'
            }
          ],
          recentActivity: recentActivity,
          upcomingDeadlines: [] // Populate with actual deadline data later
        }));
      } else {
        // Fetch vendor-specific data
        const { data: submittedProposals, error: submittedProposalsError } = await supabase
          .from('proposals')
          .select(`
            *,
            jobs (title, budget, deadline, client:users!jobs_client_id_fkey(full_name))
          `)
          .eq('vendor_id', user.id);
        if (submittedProposalsError) throw submittedProposalsError;

        const { data: activeJobs, error: activeJobsError } = await supabase
          .from('jobs')
          .select('*, client:users(full_name)') // Include client full_name in jobs query
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        if (activeJobsError) throw activeJobsError;

        const recentActivity: ActivityItem[] = [];

        // Add recent proposals
        submittedProposals?.slice(0, 3).forEach(proposal => {
          recentActivity.push({
            id: proposal.id,
            type: 'proposal',
            title: `Proposal submitted for ${proposal.jobs?.title}`,
            time: getRelativeTime(proposal.created_at),
            clientName: proposal.jobs?.client?.full_name,
          });
        });

        // Add recent job postings
        activeJobs?.slice(0, 3).forEach(job => {
          recentActivity.push({
            id: job.id,
            type: 'job',
            title: `New job posted: ${job.title}`,
            time: getRelativeTime(job.created_at),
            status: job.status,
            budget: formatCurrency(job.budget),
            clientName: job.client?.full_name,
          });
        });

        // Sort recent activity by time (most recent first)
        recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

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
          recentActivity: recentActivity,
          upcomingDeadlines: [] // Populate with actual deadline data later
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
      <DashboardWelcome user={user} />

      {/* Stats Grid */}
      <StatsGrid stats={dashboardData.stats} />

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart Card */}
        <PerformanceChart selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />

        {/* Key Metrics */}
        <KeyMetrics performanceMetrics={dashboardData.performanceMetrics} />
      </div>

      {/* Recent Activity & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <RecentActivity recentActivity={dashboardData.recentActivity} />

        {/* Upcoming Deadlines */}
        <UpcomingDeadlines upcomingDeadlines={dashboardData.upcomingDeadlines} />
      </div>
    </div>
  );
}
