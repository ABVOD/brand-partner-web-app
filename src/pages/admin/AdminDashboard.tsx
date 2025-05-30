import {
  UsersIcon,
  ExclamationTriangleIcon,
  TagIcon,
  BellIcon,
  ChartBarIcon,
  MapIcon,
  ShieldCheckIcon,
  LifebuoyIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
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
      href: '/admin/users'
    },
    {
      name: 'Active Incidents',
      value: '23',
      change: '-5%',
      changeType: 'decrease',
      icon: ExclamationTriangleIcon,
      href: '/admin/incidents'
    },
    {
      name: 'Active Offers',
      value: '156',
      change: '+8%',
      changeType: 'increase',
      icon: TagIcon,
      href: '/admin/offers'
    },
    {
      name: 'Daily Active Users',
      value: '3,842',
      change: '+15%',
      changeType: 'increase',
      icon: ChartBarIcon,
      href: '/admin/analytics'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'incident',
      title: 'New accident report submitted',
      description: 'User reported accident at Downtown intersection',
      time: '2 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'user',
      title: 'New user registration',
      description: 'john.doe@example.com joined as brand partner',
      time: '15 minutes ago',
      severity: 'normal'
    },
    {
      id: 3,
      type: 'offer',
      title: 'Promotional offer expired',
      description: 'Coffee Shop 20% discount offer expired',
      time: '1 hour ago',
      severity: 'normal'
    },
    {
      id: 4,
      type: 'system',
      title: 'System backup completed',
      description: 'Daily backup process completed successfully',
      time: '2 hours ago',
      severity: 'low'
    }
  ];

  const quickActions = [
    {
      name: 'Send Emergency Alert',
      description: 'Broadcast emergency notification to all users',
      icon: BellIcon,
      href: '/admin/notifications',
      bgColor: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      name: 'View Live Map',
      description: 'Real-time location activity heatmap',
      icon: MapIcon,
      href: '/admin/location-activity',
      bgColor: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      name: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: UsersIcon,
      href: '/admin/users',
      bgColor: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      name: 'System Health',
      description: 'Monitor system performance and status',
      icon: ShieldCheckIcon,
      href: '/admin/privacy',
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ];

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage your BrandPartner platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Link
              key={stat.name}
              to={stat.href}
              className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="rounded-lg bg-gray-50 p-3 group-hover:bg-red-50 transition-colors">
                    <stat.icon className="h-6 w-6 text-gray-600 group-hover:text-red-600" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className={`flex items-center text-sm ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'increase' ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                        activity.severity === 'high' ? 'bg-red-500' :
                        activity.severity === 'normal' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50 rounded-b-xl">
                <Link to="/admin/support" className="text-sm text-red-600 hover:text-red-700 font-medium">
                  View all activities →
                </Link>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">System Health</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Storage</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    85% Used
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CDN</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Fast
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pending Actions</h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">3 incidents need review</p>
                    <p className="text-xs text-gray-500">Reported in last hour</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">5 users pending verification</p>
                    <p className="text-xs text-gray-500">KYC verification required</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <LifebuoyIcon className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">12 support tickets open</p>
                    <p className="text-xs text-gray-500">Average response time: 2h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
} 