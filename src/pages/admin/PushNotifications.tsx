import React, { useState } from 'react';
import {
  BellIcon,
  ClockIcon,
  UsersIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CalendarIcon,
  PaperAirplaneIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ArrowTrendingUpIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  category: 'emergency' | 'marketing' | 'safety' | 'update';
  audience: 'all' | 'accident_users' | 'brand_partners' | 'specific';
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  audience: string;
  scheduledTime: Date;
  status: 'pending' | 'sent' | 'failed';
  recipientCount: number;
  deliveredCount?: number;
  openedCount?: number;
  category: string;
}

interface NotificationStats {
  totalSent: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
  lastHour: number;
  lastDay: number;
  lastWeek: number;
}

export default function PushNotifications() {
  const [activeTab, setActiveTab] = useState<'send' | 'scheduled' | 'templates' | 'analytics'>('send');
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const [selectedAudience, setSelectedAudience] = useState<'all' | 'accident_users' | 'brand_partners' | 'specific'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'emergency' | 'marketing' | 'safety' | 'update'>('safety');
  const [scheduleTime, setScheduleTime] = useState('');
  const [isImmediate, setIsImmediate] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - in real app, this would come from API
  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Emergency Alert',
      title: '🚨 Emergency Alert',
      body: 'Please ensure your safety and share your Safe ID if needed.',
      category: 'emergency',
      audience: 'accident_users',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      usageCount: 5
    },
    {
      id: '2',
      name: 'Safety Reminder',
      title: 'Safety First!',
      body: 'Remember to drive safely and keep your Safe ID up to date.',
      category: 'safety',
      audience: 'all',
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      usageCount: 12
    },
    {
      id: '3',
      name: 'New Partner Offer',
      title: 'Special Offer Available!',
      body: 'Check out exclusive offers from our partner brands in your area.',
      category: 'marketing',
      audience: 'brand_partners',
      createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      lastUsed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      usageCount: 8
    },
    {
      id: '4',
      name: 'App Update',
      title: 'App Update Available',
      body: 'Update to the latest version for improved security and new features.',
      category: 'update',
      audience: 'all',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      usageCount: 3
    }
  ]);

  const [scheduledNotifications] = useState<ScheduledNotification[]>([
    {
      id: '1',
      title: 'Weekly Safety Reminder',
      body: 'Don\'t forget to update your emergency contacts this week.',
      audience: 'All Users',
      scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
      recipientCount: 12345,
      category: 'Safety'
    },
    {
      id: '2',
      title: 'Holiday Promotion',
      body: 'Special holiday discounts from our partner brands!',
      audience: 'Brand Partners',
      scheduledTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'pending',
      recipientCount: 856,
      category: 'Marketing'
    },
    {
      id: '3',
      title: 'System Maintenance Notice',
      body: 'Scheduled maintenance tonight from 2-4 AM EST.',
      audience: 'All Users',
      scheduledTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'sent',
      recipientCount: 12345,
      deliveredCount: 12201,
      openedCount: 8954,
      category: 'Update'
    }
  ]);

  const stats: NotificationStats = {
    totalSent: 145632,
    deliveryRate: 98.7,
    openRate: 72.4,
    clickRate: 15.8,
    lastHour: 23,
    lastDay: 1247,
    lastWeek: 8956
  };

  const handleSendNotification = () => {
    if (!notificationTitle || !notificationBody) {
      alert('Please fill in both title and body');
      return;
    }

    // In real app, this would make API call
    console.log('Sending notification:', {
      title: notificationTitle,
      body: notificationBody,
      audience: selectedAudience,
      category: selectedCategory,
      immediate: isImmediate,
      scheduleTime: scheduleTime
    });

    alert(`Notification ${isImmediate ? 'sent' : 'scheduled'} successfully!`);
    
    // Reset form
    setNotificationTitle('');
    setNotificationBody('');
    setScheduleTime('');
  };

  const handleUseTemplate = (template: NotificationTemplate) => {
    setNotificationTitle(template.title);
    setNotificationBody(template.body);
    setSelectedAudience(template.audience);
    setSelectedCategory(template.category);
    setSelectedTemplate(template.id);
  };

  const getAudienceCount = (audience: string) => {
    switch (audience) {
      case 'all': return '12,345';
      case 'accident_users': return '8,234';
      case 'brand_partners': return '856';
      default: return '0';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'safety': return 'bg-yellow-100 text-yellow-800';
      case 'marketing': return 'bg-blue-100 text-blue-800';
      case 'update': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Push Notifications</h1>
          <p className="mt-2 text-gray-600">
            Send and manage push notifications to users
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PaperAirplaneIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sent</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.totalSent.toLocaleString()}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Delivery Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.deliveryRate}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <EyeIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Open Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.openRate}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Click Rate</dt>
                    <dd className="text-lg font-medium text-gray-900">{stats.clickRate}%</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'send', label: 'Send Notification', icon: PaperAirplaneIcon },
              { key: 'scheduled', label: 'Scheduled', icon: CalendarIcon },
              { key: 'templates', label: 'Templates', icon: DocumentTextIcon },
              { key: 'analytics', label: 'Analytics', icon: ChartBarIcon }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Send Notification Tab */}
        {activeTab === 'send' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compose Form */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Compose Notification</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notification Title
                  </label>
                  <input
                    type="text"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    placeholder="Enter notification title..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Body
                  </label>
                  <textarea
                    value={notificationBody}
                    onChange={(e) => setNotificationBody(e.target.value)}
                    placeholder="Enter notification message..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="safety">Safety</option>
                      <option value="emergency">Emergency</option>
                      <option value="marketing">Marketing</option>
                      <option value="update">Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audience
                    </label>
                    <select
                      value={selectedAudience}
                      onChange={(e) => setSelectedAudience(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="all">All Users ({getAudienceCount('all')})</option>
                      <option value="accident_users">Accident Users ({getAudienceCount('accident_users')})</option>
                      <option value="brand_partners">Brand Partners ({getAudienceCount('brand_partners')})</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={isImmediate}
                        onChange={() => setIsImmediate(true)}
                        className="mr-2"
                      />
                      Send immediately
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!isImmediate}
                        onChange={() => setIsImmediate(false)}
                        className="mr-2"
                      />
                      Schedule for later
                    </label>
                  </div>
                  
                  {!isImmediate && (
                    <div className="mt-2">
                      <input
                        type="datetime-local"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSendNotification}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  {isImmediate ? 'Send Notification' : 'Schedule Notification'}
                </button>
              </div>
            </div>

            {/* Templates Quick Select */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Quick Templates</h2>
              
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUseTemplate(template)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{template.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{template.title}</p>
                    <p className="text-xs text-gray-500">{template.body}</p>
                    <div className="mt-2 text-xs text-gray-400">
                      Used {template.usageCount} times
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Notifications Tab */}
        {activeTab === 'scheduled' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Scheduled Notifications</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scheduled Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {scheduledNotifications.map((notification) => (
                    <tr key={notification.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                          <div className="text-sm text-gray-500">{notification.body}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.audience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {notification.scheduledTime.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                          {notification.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div>{notification.recipientCount.toLocaleString()} total</div>
                          {notification.deliveredCount && (
                            <div className="text-xs text-gray-500">
                              {notification.deliveredCount.toLocaleString()} delivered
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          {notification.status === 'pending' && (
                            <>
                              <button className="text-gray-600 hover:text-gray-900">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Notification Templates</h2>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Create Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {template.category}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">{template.title}</p>
                    <p className="text-sm text-gray-600">{template.body}</p>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    <div>Audience: {template.audience.replace('_', ' ')}</div>
                    <div>Used {template.usageCount} times</div>
                    {template.lastUsed && (
                      <div>Last used: {template.lastUsed.toLocaleDateString()}</div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUseTemplate(template)}
                      className="flex-1 bg-indigo-600 text-white text-xs py-2 px-3 rounded hover:bg-indigo-700"
                    >
                      Use Template
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Last Hour</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.lastHour}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Last Day</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.lastDay.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Last Week</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.lastWeek.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Performance Metrics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{stats.deliveryRate}%</div>
                  <div className="text-sm text-gray-500">Delivery Rate</div>
                  <div className="mt-1">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.openRate}%</div>
                  <div className="text-sm text-gray-500">Open Rate</div>
                  <div className="mt-1">
                    <EyeIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">{stats.clickRate}%</div>
                  <div className="text-sm text-gray-500">Click Rate</div>
                  <div className="mt-1">
                    <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.totalSent.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Total Sent</div>
                  <div className="mt-1">
                    <PaperAirplaneIcon className="h-5 w-5 text-gray-400 mx-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 