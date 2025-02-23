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
import { LoadingPage } from '../ui/LoadingSpinner';

const titleFontClass = 'font-semibold text-gray-900 dark:text-white';
const textFontClass = 'text-gray-500 dark:text-gray-400';
const valueFontClass = 'text-3xl font-bold text-gray-900 dark:text-white';
const statFontClass = 'text-sm font-medium text-gray-500 dark:text-gray-400';
const cardClass = 'bg-white dark:bg-gray-800 shadow-sm rounded-xl p-4';
const sectionClass = 'mb-8';
const sectionTitleClass = 'text-2xl font-bold text-gray-900 dark:text-white mb-4';
const sectionDescriptionClass = 'text-gray-600 dark:text-gray-400 mb-6';

// Define interfaces for data structures
interface Stat {
  name: string;
  value: string | number;
  icon: React.ElementType;
  change: string;
  changeType: 'increase' | 'decrease';
  color: string;
  metric: string;
  comparison: string;
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
    const [activeJobsFilter, setActiveJobsFilter] = useState('All Types');

  //Update Key Metrics
  interface DashboardData {
    stats: Stat[];
    recentActivity: ActivityItem[];
    upcomingDeadlines: DeadlineItem[];
    keyMetrics: { // Added keyMetrics to the interface
      earningsThisMonth: number;
      earningsChange: number;
      activeJobs: number;
      activeJobsChange: number;
      successRate: number;
      successRateChange: number;
    };
  }

  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: [],
    recentActivity: [],
    upcomingDeadlines: [],
    keyMetrics: { // Initialize keyMetrics with default values
      earningsThisMonth: 0,
      earningsChange: 0,
      activeJobs: 0,
      activeJobsChange: 0,
      successRate: 0,
      successRateChange: 0,
    },
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const createStat = (name: string, value: string | number, icon: React.ElementType, change: string, changeType: 'increase' | 'decrease', color: string, metric: string, comparison: string) => {
    return { name, value, icon, change, changeType, color, metric, comparison };
  };

      let submittedProposals: any = []; 
async function fetchDashboardData() {
    if (!user) return;

    let submittedProposals: any = []; // Declaring submittedProposals here

    //for calculating the change
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    let submittedProposals: any = []; // Moved outside the if/else and initialized

    try {
      if (user && user.role === 'client') {
        // Client dashboard - to be implemented later
      } else {
        // Vendor dashboard
        const { data: submittedProposalsData, error: submittedProposalsError } = await supabase
          .from('proposals')
          .select(`*, jobs!inner(title, budget, deadline, client_id, clients:users(full_name), status)`)
          .eq('vendor_id', user.id);
        if (submittedProposalsError) throw submittedProposalsError;
        submittedProposals = submittedProposalsData;

        // ... (rest of the vendor dashboard data fetching logic - same as before, but ONLY ONCE) ...
         // Fetch active jobs with client information and order by creation date
        let { data: activeJobs, error: activeJobsError } = await supabase
          .from('jobs')
          .select('*, client:users(full_name)')
          .in('status', ['active', 'in_progress'])
          .order('created_at', { ascending: false });

        if (activeJobsError) throw activeJobsError;

        // Fetch earnings data for vendors
        const { data: vendorPayments, error: vendorPaymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('vendor_id', user.id);
        if (vendorPaymentsError) throw vendorPaymentsError;

        const totalEarnings = vendorPayments?.reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;
        const thisMonthEarnings = vendorPayments?.filter((payment: any) => new Date(payment.created_at).getMonth() === new Date().getMonth()).reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;
        const lastMonthEarnings = vendorPayments?.filter((payment: any) => { const paymentDate = new Date(payment.created_at); return paymentDate >= firstDayOfLastMonth && paymentDate <= lastDayOfLastMonth; }).reduce((sum: number, payment: any) => sum + payment.amount, 0) || 0;
        const earningsChange = lastMonthEarnings === 0 ? 100 : ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings) * 100;
        const pendingEarnings = submittedProposals?.filter((proposal: any) => proposal.status === 'pending_payment').reduce((sum: number, proposal: any) => sum + (proposal.jobs?.budget || 0), 0) || 0;
        const projectedEarnings = pendingEarnings;
        const activeJobsCount = submittedProposals?.filter((proposal:any) => proposal.jobs?.status === 'active').length || 0;


        const keyMetrics = {
          earningsThisMonth: thisMonthEarnings,
          earningsChange: earningsChange,
          activeJobs: activeJobsCount,
          activeJobsChange: 5, //Dummy
          successRate: 94, //Dummy
          successRateChange: 2 //Dummy
        };


        const recentActivity: ActivityItem[] = [];
        submittedProposals?.slice(0, 3).forEach((proposal: any) => {
          recentActivity.push({
            id: proposal.id,
            type: 'proposal',
            title: `Proposal submitted for ${proposal.jobs?.title}`,
            time: getRelativeTime(proposal.created_at),
            clientName: proposal.jobs?.client?.full_name,
          });
        });
        activeJobs?.slice(0, 3).forEach((job: any) => {
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
        recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());


        setDashboardData((prev) => ({
          ...prev,
          stats: [
            createStat('Job Success Score', '98%', Award, '+2.1%', 'increase', 'bg-green-500', 'Score', '96%'),
            createStat('Response Time', '1.2h', Clock, '-15%', 'decrease', 'bg-purple-500', 'Avg', '1.4h'),
            createStat('Top Rated', '4.9', Star, '+0.3%', 'increase', 'bg-indigo-500', 'Stars', '4.8'),
            createStat('Earnings', formatCurrency(totalEarnings), DollarSign, '+18.4%', 'increase', 'bg-blue-500', 'Total', formatCurrency(10500))
          ],
          recentActivity: recentActivity,
          upcomingDeadlines: [],
          keyMetrics: keyMetrics,
        }));
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData({
        stats: [],
        recentActivity: [],
        upcomingDeadlines: [],
        keyMetrics: {
          earningsThisMonth: 0,
          earningsChange: 0,
          activeJobs: 0,
          activeJobsChange: 0,
          successRate: 0,
          successRateChange: 0,
        },
      });
      alert('Error fetching dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white/90">
          Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <div>
          <DashboardWelcome user={user} titleFontClass={titleFontClass} textFontClass={textFontClass} />
        </div>

        <div className="space-y-6">
          <StatsGrid stats={dashboardData.stats} cardClass={cardClass} valueFontClass={valueFontClass} statFontClass={statFontClass} />
          <PerformanceChart selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} cardClass={cardClass} titleFontClass={titleFontClass} textFontClass={textFontClass} />
          <KeyMetrics {...dashboardData.keyMetrics} cardClass={cardClass} titleFontClass={titleFontClass} textFontClass={textFontClass} valueFontClass={valueFontClass} />
          <RecentActivity recentActivity={dashboardData.recentActivity} />
          <div className={cardClass}>
              <h2 className={sectionTitleClass}>Active Jobs</h2>
              <div className="mb-4">
                  <label htmlFor="job-type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Filter by Type:
                  </label>
                  <select
                      id="job-type-filter"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={activeJobsFilter}
                      onChange={(e) => setActiveJobsFilter(e.target.value)}
                  >
                      <option value="All Types">All Types</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                  </select>
              </div>
              
              {user?.role === 'vendor' ? (
                  dashboardData.keyMetrics.activeJobs > 0 ? (
                      <ul className="space-y-4">
                          {submittedProposals?.filter(
                              (proposal:any) => activeJobsFilter === "All Types" ||
                              (activeJobsFilter === "In Progress" && proposal.jobs.status === "active") ||
                              (activeJobsFilter === "Pending" && proposal.status === "pending_payment" ) ||
                              (activeJobsFilter === "Proposal Sent" && proposal.status === "submitted")
                          ).map((proposal:any) => (
                              <li key={proposal.id} className="border-b border-gray-200 pb-4 last:border-0">
                                  <div className="flex items-center justify-between">
                                      <div>
                                          <h3 className={titleFontClass}>{proposal.jobs.title}</h3>
                                          <p className={textFontClass}>{proposal.jobs.client.full_name}</p>
                                          <p className={textFontClass}>{proposal.jobs.location ? proposal.jobs.location: 'Remote'}</p>
                                          <p className={textFontClass}>{proposal.jobs.deadline}</p>
                                      </div>
                                      <div>
                                          <p className={valueFontClass}>{formatCurrency(proposal.jobs.budget)}</p>
                                          <p className={statFontClass}>{proposal.status}</p>
                                      </div>
                                  </div>
                              </li>
                          ))}
                      </ul>
                  ) : (
                      <p className={textFontClass}>No active jobs found.</p>
                  )
              ) : (
                  <p className={textFontClass}>Active jobs information is displayed for vendors.</p>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
