import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Bell, Calendar, DollarSign, Briefcase, Star, ChevronRight, Search, Settings, MessageSquare, Filter, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const EventWorkDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const [fullName, setFullName] = useState('User');

    useEffect(() => {
      const fetchUserData = async () => {
        console.log("User object:", user);
        if (user?.id) {
          const { data, error } = await supabase
            .from('users')
            .select('full_name')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error("Supabase fetch error:", error);
          } else if (data?.full_name) {
            setFullName(data.full_name);
          }
        }
      };

      fetchUserData();
    }, [user?.id]);

  // Enhanced sample data
  const recentJobs = [
    {
      id: 1,
      title: "Wedding Photography Lead",
      budget: "$800",
      date: "Mar 15",
      status: "In Progress",
      location: "San Francisco, CA",
      client: "Emma Wilson",
      type: "Wedding",
      hoursLogged: "12/20"
    },
    { 
      id: 2, 
      title: "Corporate Event MC",
      budget: "$500",
      date: "Mar 18",
      status: "Pending",
      location: "New York, NY",
      client: "Tech Corp Inc.",
      type: "Corporate",
      hoursLogged: "0/8"
    },
    { 
      id: 3, 
      title: "Concert Sound Engineer",
      budget: "$1200",
      date: "Mar 20",
      status: "Proposal Sent",
      location: "Los Angeles, CA",
      client: "Music Festival Co.",
      type: "Concert",
      hoursLogged: "0/15"
    }
  ];

  const notifications = [
    { 
      id: 1, 
      text: "New message from Wedding Planner Sarah",
      time: "2h ago",
      type: "message",
      priority: "high"
    },
    { 
      id: 2, 
      text: "Proposal accepted for Corporate Event",
      time: "5h ago",
      type: "proposal",
      priority: "high"
    },
    { 
      id: 3, 
      text: "New job match: Festival Stage Manager",
      time: "1d ago",
      type: "job",
      priority: "medium"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Conference 2024",
      date: "Mar 25",
      time: "9:00 AM - 5:00 PM",
      location: "Convention Center",
      role: "AV Technician"
    },
    {
      id: 2,
      title: "Smith-Jones Wedding",
      date: "Mar 28",
      time: "2:00 PM - 10:00 PM",
      location: "Grand Hotel",
      role: "Lead Photographer"
    }
  ];

  const earningsData = [
    { month: 'Jan', amount: 2100 },
    { month: 'Feb', amount: 2300 },
    { month: 'Mar', amount: 2450 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
          <h1 className="text-xl font-bold">EventWork</h1>
        </div>
        
        <nav className="space-y-2">
          {[
            { icon: Briefcase, label: 'Overview', value: 'overview' },
            { icon: Calendar, label: 'Schedule', value: 'schedule' },
            { icon: MessageSquare, label: 'Messages', value: 'messages' },
            { icon: DollarSign, label: 'Earnings', value: 'earnings' },
            { icon: Settings, label: 'Settings', value: 'settings' }
          ].map(item => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                activeTab === item.value
                  ? 'bg-accent-50 text-accent-700 font-semibold' // Accent color for active tab
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-heading">Welcome back, {fullName}</h2> {/* Heading font */}
            <p className="text-gray-500">Here's what's happening with your events</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search events, clients..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1"></div>
              <Bell className="h-6 w-6 text-gray-600 cursor-pointer" />
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-md"> {/* Card shadow */}
            <CardContent className="flex items-center p-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Earnings this month</p>
                <p className="text-xl font-bold">$2,450</p>
                <p className="text-xs text-green-600">+15% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md"> {/* Card shadow */}
            <CardContent className="flex items-center p-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Active Jobs</p>
                <p className="text-xl font-bold">4</p>
                <p className="text-xs text-green-600">2 due this week</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md"> {/* Card shadow */}
            <CardContent className="flex items-center p-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-xl font-bold">94%</p>
                <p className="text-xs text-purple-600">Based on 50 events</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md"> {/* Card shadow */}
            <CardContent className="flex items-center p-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Upcoming Events</p>
                <p className="text-xl font-bold">6</p>
                <p className="text-xs text-orange-600">Next: Mar 25</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Jobs */}
          <Card className="lg:col-span-2 shadow-md"> {/* Card shadow */}
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-heading">Active Jobs</CardTitle> {/* Heading font */}
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Filter className="h-4 w-4 text-gray-500" />
                </button>
                <select className="border rounded-lg px-3 py-1 text-sm text-gray-600">
                  <option>All Types</option>
                  <option>Wedding</option>
                  <option>Corporate</option>
                  <option>Concert</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer shadow-sm"> {/* Card shadow */}
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{job.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-500">{job.location}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <p className="text-sm text-gray-500">{job.hoursLogged} hours</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-gray-900 font-medium">{job.budget}</span>
                        <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800 block mt-1">
                          {job.status}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="shadow-md"> {/* Card shadow */}
              <CardHeader>
                <CardTitle className="font-heading">Upcoming Events</CardTitle> {/* Heading font */}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer shadow-sm"> {/* Card shadow */}
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                        {event.role}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="shadow-md"> {/* Card shadow */}
              <CardHeader>
                <CardTitle className="font-heading">Notifications</CardTitle> {/* Heading font */}
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notifications.map(notification => (
                    <div key={notification.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer shadow-sm"> {/* Card shadow */}
                      <div className={`p-2 rounded-full ${
                        notification.type === 'message' ? 'bg-blue-100' :
                        notification.type === 'proposal' ? 'bg-green-100' : 'bg-orange-100'
                      }`}>
                        {notification.type === 'message' ? (
                          <MessageSquare className="h-4 w-4 text-blue-600" />
                        ) : notification.type === 'proposal' ? (
                          <DollarSign className="h-4 w-4 text-green-600" />
                        ) : (
                          <Briefcase className="h-4 w-4 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{notification.text}</p>
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                      {notification.priority === 'high' && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                          High Priority
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventWorkDashboard;
