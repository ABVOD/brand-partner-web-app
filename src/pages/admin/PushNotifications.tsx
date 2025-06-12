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
      case 'emergency':
        return 'bg-red-900/50 text-red-300';
      case 'marketing':
        return 'bg-blue-900/50 text-blue-300';
      case 'safety':
        return 'bg-green-900/50 text-green-300';
      case 'update':
        return 'bg-purple-900/50 text-purple-300';
      default:
        return 'bg-gray-600/50 text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'sent':
        return 'bg-green-900/50 text-green-300';
      case 'failed':
        return 'bg-red-900/50 text-red-300';
      default:
        return 'bg-gray-600/50 text-gray-300';
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Push Notifications</h1>
            <p className="text-gray-400 mt-1">Send and manage push notifications to users</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'send', label: 'Send Notification', icon: PaperAirplaneIcon },
              { id: 'scheduled', label: 'Scheduled', icon: ClockIcon },
              { id: 'templates', label: 'Templates', icon: DocumentTextIcon },
              { id: 'analytics', label: 'Analytics', icon: ChartBarIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Send Notification Tab */}
        {activeTab === 'send' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notification Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-6">Create Notification</h3>
                
                <div className="space-y-6">
                  {/* Template Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Use Template (Optional)
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => {
                        const template = templates.find(t => t.id === e.target.value);
                        if (template) handleUseTemplate(template);
                      }}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select a template...</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notification Title *
                    </label>
                    <input
                      type="text"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                      placeholder="Enter notification title..."
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Notification Body *
                    </label>
                    <textarea
                      value={notificationBody}
                      onChange={(e) => setNotificationBody(e.target.value)}
                      placeholder="Enter notification message..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Audience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={selectedAudience}
                      onChange={(e) => setSelectedAudience(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Users ({getAudienceCount('all')})</option>
                      <option value="accident_users">Accident Users ({getAudienceCount('accident_users')})</option>
                      <option value="brand_partners">Brand Partners ({getAudienceCount('brand_partners')})</option>
                      <option value="specific">Specific Users</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="safety">Safety</option>
                      <option value="emergency">Emergency</option>
                      <option value="marketing">Marketing</option>
                      <option value="update">Update</option>
                    </select>
                  </div>

                  {/* Scheduling */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Delivery
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={isImmediate}
                          onChange={() => setIsImmediate(true)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700"
                        />
                        <span className="ml-2 text-sm text-gray-300">Send immediately</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          checked={!isImmediate}
                          onChange={() => setIsImmediate(false)}
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 bg-gray-700"
                        />
                        <span className="ml-2 text-sm text-gray-300">Schedule for later</span>
                      </label>
                      {!isImmediate && (
                        <input
                          type="datetime-local"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      )}
                    </div>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendNotification}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center justify-center space-x-2"
                  >
                    <PaperAirplaneIcon className="h-4 w-4" />
                    <span>{isImmediate ? 'Send Now' : 'Schedule Notification'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Preview</h3>
                <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-purple-900/50 rounded-lg">
                      <BellIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-100">
                        {notificationTitle || 'Notification Title'}
                      </h4>
                      <p className="text-sm text-gray-300 mt-1">
                        {notificationBody || 'Notification message will appear here...'}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        Safe ID App • now
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Audience:</span>
                    <span className="text-gray-300">{getAudienceCount(selectedAudience)} users</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Category:</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(selectedCategory)}`}>
                      {selectedCategory}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Delivery:</span>
                    <span className="text-gray-300">
                      {isImmediate ? 'Immediate' : 'Scheduled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scheduled Tab */}
        {activeTab === 'scheduled' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-900/50 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">
                      {scheduledNotifications.filter(n => n.status === 'pending').length}
                    </p>
                    <p className="text-sm text-gray-400">Pending</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-900/50 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">
                      {scheduledNotifications.filter(n => n.status === 'sent').length}
                    </p>
                    <p className="text-sm text-gray-400">Sent</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-900/50 rounded-lg">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">
                      {scheduledNotifications.filter(n => n.status === 'failed').length}
                    </p>
                    <p className="text-sm text-gray-400">Failed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduled Notifications List */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-gray-100">Scheduled Notifications</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Notification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Audience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Scheduled Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Performance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {scheduledNotifications.map((notification) => (
                      <tr key={notification.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-100">{notification.title}</div>
                            <div className="text-sm text-gray-400">{notification.body}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UsersIcon className="h-4 w-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-100">{notification.audience}</div>
                              <div className="text-sm text-gray-400">{notification.recipientCount.toLocaleString()} users</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {notification.scheduledTime.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-400">
                            {notification.scheduledTime.toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(notification.status)}`}>
                            {notification.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {notification.status === 'sent' && (
                            <div className="text-sm">
                              <div className="text-gray-300">
                                {notification.deliveredCount?.toLocaleString()} delivered
                              </div>
                              <div className="text-gray-400">
                                {notification.openedCount?.toLocaleString()} opened
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {notification.status === 'pending' && (
                              <>
                                <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg">
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
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.filter(template => 
                template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.title.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((template) => (
                <div key={template.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">{template.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-gray-700 rounded-lg"
                      >
                        <PaperAirplaneIcon className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-medium text-gray-100 mb-1">{template.title}</h4>
                    <p className="text-sm text-gray-300">{template.body}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>Used {template.usageCount} times</span>
                    {template.lastUsed && (
                      <span>Last used {template.lastUsed.toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-900/50 rounded-lg">
                    <PaperAirplaneIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">{stats.totalSent.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Total Sent</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-900/50 rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">{stats.deliveryRate}%</p>
                    <p className="text-sm text-gray-400">Delivery Rate</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-900/50 rounded-lg">
                    <EyeIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">{stats.openRate}%</p>
                    <p className="text-sm text-gray-400">Open Rate</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-900/50 rounded-lg">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-2xl font-bold text-gray-100">{stats.clickRate}%</p>
                    <p className="text-sm text-gray-400">Click Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Last Hour</span>
                    <span className="text-sm font-medium text-gray-100">{stats.lastHour}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Last 24 Hours</span>
                    <span className="text-sm font-medium text-gray-100">{stats.lastDay.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Last 7 Days</span>
                    <span className="text-sm font-medium text-gray-100">{stats.lastWeek.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-100 mb-4">Performance by Category</h3>
                <div className="space-y-4">
                  {['emergency', 'safety', 'marketing', 'update'].map((category) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                          {category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">98.5% delivered</span>
                        <span className="text-gray-400">72.3% opened</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 