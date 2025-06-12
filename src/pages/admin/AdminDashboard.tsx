import {
  UsersIcon,
  ExclamationTriangleIcon,
  TagIcon,
  BellIcon,
  MapIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  IdentificationIcon,
  BuildingOfficeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

export default function AdminDashboard() {
  // Mock data - in a real app, this would come from your backend
  const stats = [
    {
      name: 'Total Users',
      value: '12,345',
      change: '+12%',
      changeType: 'increase',
      icon: UsersIcon,
      href: '/admin/users',
      description: 'All registered users'
    },
    {
      name: 'Brand Partners',
      value: '856',
      change: '+8%',
      changeType: 'increase',
      icon: BuildingOfficeIcon,
      href: '/admin/users?filter=brand_partner',
      description: 'Active brand partners'
    },
    {
      name: 'Accident Users',
      value: '8,234',
      change: '+15%',
      changeType: 'increase',
      icon: UserGroupIcon,
      href: '/admin/users?filter=accident_user',
      description: 'Users with accident coverage'
    },
    {
      name: 'Active Incidents',
      value: '23',
      change: '-5%',
      changeType: 'decrease',
      icon: ExclamationTriangleIcon,
      href: '/admin/incidents',
      description: 'Ongoing accident cases'
    },
    {
      name: 'Safe ID Shares',
      value: '2,847',
      change: '+22%',
      changeType: 'increase',
      icon: IdentificationIcon,
      href: '/admin/safe-ids',
      description: 'Monthly safe ID shares'
    },
    {
      name: 'Insurance Claims',
      value: '156',
      change: '+6%',
      changeType: 'increase',
      icon: ShieldCheckIcon,
      href: '/admin/insurance-companies',
      description: 'Claims processed this month'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'incident',
      title: 'New accident report submitted',
      description: 'Alice Driver reported vehicle collision - Safe ID shared with State Farm',
      time: '2 minutes ago',
      severity: 'high',
      userType: 'accident_user'
    },
    {
      id: 2,
      type: 'user',
      title: 'New brand partner registration',
      description: 'Local Coffee Shop registered for advertising campaigns',
      time: '15 minutes ago',
      severity: 'normal',
      userType: 'brand_partner'
    },
    {
      id: 3,
      type: 'safe_id',
      title: 'Safe ID shared with insurance',
      description: 'Bob Commuter shared Safe ID SF-7N9P-3K5M-T2W6 with Progressive',
      time: '45 minutes ago',
      severity: 'normal',
      userType: 'accident_user'
    },
    {
      id: 4,
      type: 'offer',
      title: 'Promotional campaign launched',
      description: 'Starbucks activated location-based 20% discount offer',
      time: '1 hour ago',
      severity: 'normal',
      userType: 'brand_partner'
    },
    {
      id: 5,
      type: 'verification',
      title: 'User verification completed',
      description: 'Carol Cyclist completed identity verification for accident coverage',
      time: '2 hours ago',
      severity: 'low',
      userType: 'accident_user'
    }
  ];

  const quickActions = [
    {
      name: 'Emergency Alert',
      description: 'Send emergency notifications to accident users',
      icon: BellIcon,
      href: '/admin/emergency-alerts',
      bgColor: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    },
    {
      name: 'Live Incident Map',
      description: 'Real-time accident and incident tracking',
      icon: MapIcon,
      href: '/admin/incident-map',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      name: 'User Management',
      description: 'Manage all user types and permissions',
      icon: UsersIcon,
      href: '/admin/users',
      bgColor: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    },
    {
      name: 'Safe ID Registry',
      description: 'Monitor and manage Safe ID system',
      icon: IdentificationIcon,
      href: '/admin/safe-ids',
      bgColor: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700'
    },
    {
      name: 'Insurance Partners',
      description: 'Manage insurance company integrations',
      icon: ShieldCheckIcon,
      href: '/admin/insurance-companies',
      bgColor: 'bg-indigo-600',
      hoverColor: 'hover:bg-indigo-700'
    },
    {
      name: 'Brand Campaigns',
      description: 'Oversee advertising campaigns and offers',
      icon: TagIcon,
      href: '/admin/brand-campaigns',
      bgColor: 'bg-yellow-600',
      hoverColor: 'hover:bg-yellow-700'
    }
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Admin Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Monitor and manage your BrandPartner platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              to={stat.href}
              className="relative overflow-hidden rounded-xl bg-gray-800 p-6 shadow-sm border border-gray-700 hover:shadow-md transition-all duration-200 group hover:border-purple-600/50"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-lg bg-gray-700 p-3 group-hover:bg-purple-900/50 transition-colors">
                    <stat.icon className="h-6 w-6 text-gray-400 group-hover:text-purple-400" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                    <div className={`flex items-center text-sm ${
                      stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* User Type Overview */}
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">User Type Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-100">Brand Partners</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Active Campaigns</span>
                  <span className="text-sm font-medium text-gray-100">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Monthly Ad Spend</span>
                  <span className="text-sm font-medium text-gray-100">$45,230</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Avg. Engagement Rate</span>
                  <span className="text-sm font-medium text-green-400">12.4%</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-100">Accident Users</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Active Safe IDs</span>
                  <span className="text-sm font-medium text-gray-100">7,892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Insurance Partners</span>
                  <span className="text-sm font-medium text-gray-100">15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Avg. Response Time</span>
                  <span className="text-sm font-medium text-green-400">4.2 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.href}
                className={`relative group ${action.bgColor} ${action.hoverColor} rounded-xl p-6 text-white shadow-lg transition-all duration-200 transform hover:scale-105`}
              >
                <div className="flex items-center space-x-4">
                  <action.icon className="h-8 w-8 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{action.name}</h3>
                    <p className="text-sm opacity-90 mt-1">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-gray-100">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-700">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                        activity.severity === 'high' ? 'bg-red-400' :
                        activity.severity === 'normal' ? 'bg-yellow-400' : 'bg-green-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-100">{activity.title}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            activity.userType === 'brand_partner' ? 'bg-purple-900/50 text-purple-300' :
                            activity.userType === 'accident_user' ? 'bg-orange-900/50 text-orange-300' :
                            'bg-gray-600/50 text-gray-300'
                          }`}>
                            {activity.userType === 'brand_partner' ? 'Brand' : 
                             activity.userType === 'accident_user' ? 'Accident' : 'System'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-700/50 rounded-b-xl">
                <Link to="/admin/activity-log" className="text-sm text-red-400 hover:text-red-300 font-medium">
                  View all activities →
                </Link>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-gray-100">System Health</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">API Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Database</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Safe ID System</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Insurance APIs</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Storage</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
                    85% Used
                  </span>
                </div>
              </div>
            </div>

            {/* Insurance Integration Status */}
            <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
              <div className="px-6 py-4 border-b border-gray-700">
                <h2 className="text-lg font-semibold text-gray-100">Insurance Partners</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">State Farm</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Progressive</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Geico</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Allstate</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
} 