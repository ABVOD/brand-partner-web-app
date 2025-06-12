import { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  TicketIcon,
  UserIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface SupportMessage {
  id: string;
  content: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  senderName: string;
  attachments?: string[];
}

interface SupportRequest {
  id: string;
  ticketNumber: string;
  subject: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userType: 'brand' | 'individual' | 'driver' | 'partner';
  userName: string;
  userEmail: string;
  category: 'technical' | 'billing' | 'account' | 'campaign' | 'general';
  assignedTo?: string;
  createdAt: Date;
  lastUpdated: Date;
  messages: SupportMessage[];
  tags: string[];
}

export default function SupportManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'tickets'>('overview');
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [newMessage, setNewMessage] = useState('');

  // Mock data - in real app, this would come from API
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([
    {
      id: '1',
      ticketNumber: 'TKT-001',
      subject: 'Campaign analytics not loading',
      status: 'open',
      priority: 'high',
      userType: 'brand',
      userName: 'Acme Corporation',
      userEmail: 'support@acmecorp.com',
      category: 'technical',
      assignedTo: 'Admin User',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000),
      messages: [
        {
          id: '1',
          content: 'Hi, our campaign analytics dashboard is not loading. We\'re unable to see our performance metrics.',
          sender: 'user',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          senderName: 'Acme Corporation',
        },
        {
          id: '2',
          content: 'Thank you for reporting this issue. I\'m looking into the analytics system now. Can you tell me which specific metrics you\'re trying to view?',
          sender: 'admin',
          timestamp: new Date(Date.now() - 90 * 60 * 1000),
          senderName: 'Admin User',
        },
        {
          id: '3',
          content: 'We need to see our CTR, conversion rates, and geographic performance data for our recent campaigns.',
          sender: 'user',
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          senderName: 'Acme Corporation',
        },
      ],
      tags: ['analytics', 'dashboard', 'urgent'],
    },
    {
      id: '2',
      ticketNumber: 'TKT-002',
      subject: 'Billing discrepancy',
      status: 'in-progress',
      priority: 'medium',
      userType: 'brand',
      userName: 'Tech Startup Inc',
      userEmail: 'billing@techstartup.com',
      category: 'billing',
      assignedTo: 'Admin User',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000),
      messages: [
        {
          id: '1',
          content: 'There seems to be a billing discrepancy in our last invoice. We were charged for premium features we didn\'t use.',
          sender: 'user',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          senderName: 'Tech Startup Inc',
        },
      ],
      tags: ['billing', 'invoice'],
    },
    {
      id: '3',
      ticketNumber: 'TKT-003',
      subject: 'Account verification help',
      status: 'resolved',
      priority: 'low',
      userType: 'individual',
      userName: 'John Doe',
      userEmail: 'john.doe@email.com',
      category: 'account',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
      messages: [
        {
          id: '1',
          content: 'I need help verifying my account. I uploaded my documents but haven\'t heard back.',
          sender: 'user',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          senderName: 'John Doe',
        },
      ],
      tags: ['verification', 'documents'],
    },
  ]);

  const filteredRequests = supportRequests.filter(request => {
    if (searchQuery && !request.subject.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !request.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !request.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && request.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && request.priority !== priorityFilter) return false;
    if (userTypeFilter !== 'all' && request.userType !== userTypeFilter) return false;
    if (categoryFilter !== 'all' && request.category !== categoryFilter) return false;
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-900/50 text-red-300';
      case 'in-progress':
        return 'bg-blue-900/50 text-blue-300';
      case 'resolved':
        return 'bg-green-900/50 text-green-300';
      case 'closed':
        return 'bg-gray-600/50 text-gray-300';
      default:
        return 'bg-gray-600/50 text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-900/50 text-red-300';
      case 'high':
        return 'bg-orange-900/50 text-orange-300';
      case 'medium':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'low':
        return 'bg-green-900/50 text-green-300';
      default:
        return 'bg-gray-600/50 text-gray-300';
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'brand':
        return BuildingOfficeIcon;
      case 'individual':
      case 'driver':
      case 'partner':
      default:
        return UserIcon;
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && selectedRequest) {
      const message: SupportMessage = {
        id: Date.now().toString(),
        content: newMessage,
        sender: 'admin',
        timestamp: new Date(),
        senderName: 'Admin User',
      };

      const updatedRequest = {
        ...selectedRequest,
        messages: [...selectedRequest.messages, message],
        lastUpdated: new Date(),
      };

      setSupportRequests(prev => 
        prev.map(req => req.id === selectedRequest.id ? updatedRequest : req)
      );
      setSelectedRequest(updatedRequest);
      setNewMessage('');
    }
  };

  const updateRequestStatus = (requestId: string, newStatus: SupportRequest['status']) => {
    setSupportRequests(prev =>
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: newStatus, lastUpdated: new Date() }
          : req
      )
    );
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest({ ...selectedRequest, status: newStatus, lastUpdated: new Date() });
    }
  };

  const stats = {
    totalRequests: supportRequests.length,
    openRequests: supportRequests.filter(r => r.status === 'open').length,
    inProgressRequests: supportRequests.filter(r => r.status === 'in-progress').length,
    resolvedToday: supportRequests.filter(r => 
      r.status === 'resolved' && 
      r.lastUpdated.toDateString() === new Date().toDateString()
    ).length,
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-100 sm:truncate sm:text-3xl sm:tracking-tight">
            Support Management
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Manage support requests from brands, users, and partners
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TicketIcon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Requests</dt>
                    <dd className="text-lg font-medium text-gray-100">{stats.totalRequests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Open</dt>
                    <dd className="text-lg font-medium text-gray-100">{stats.openRequests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                    <dd className="text-lg font-medium text-gray-100">{stats.inProgressRequests}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Resolved Today</dt>
                    <dd className="text-lg font-medium text-gray-100">{stats.resolvedToday}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`${
                activeTab === 'tickets'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              All Tickets
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`${
                activeTab === 'chat'
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Chat Interface
            </button>
          </nav>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="relative">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                >
                  <option value="all">All Users</option>
                  <option value="brand">Brands</option>
                  <option value="individual">Individuals</option>
                  <option value="driver">Drivers</option>
                  <option value="partner">Partners</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                >
                  <option value="all">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="account">Account</option>
                  <option value="campaign">Campaign</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* Recent Tickets List */}
            <div className="bg-gray-800 shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-gray-100">Recent Support Requests</h3>
              </div>
              <ul role="list" className="divide-y divide-gray-700">
                {filteredRequests.slice(0, 10).map((request) => {
                  const UserTypeIcon = getUserTypeIcon(request.userType);
                  return (
                    <li key={request.id} className="px-6 py-4 hover:bg-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <UserTypeIcon className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-100 truncate">
                                {request.subject}
                              </p>
                              <span className="text-xs text-gray-400">#{request.ticketNumber}</span>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <p className="text-sm text-gray-400">{request.userName}</p>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-gray-400 capitalize">{request.userType}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setActiveTab('chat');
                            }}
                            className="text-purple-600 hover:text-purple-900 text-sm font-medium"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-gray-800 shadow rounded-lg p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <div className="relative">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-100 ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                >
                  <option value="all">All Priority</option>
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <select
                  value={userTypeFilter}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                >
                  <option value="all">All Users</option>
                  <option value="brand">Brands</option>
                  <option value="individual">Individuals</option>
                  <option value="driver">Drivers</option>
                  <option value="partner">Partners</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-100 ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
                >
                  <option value="all">All Categories</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="account">Account</option>
                  <option value="campaign">Campaign</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            {/* Full Tickets List */}
            <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ticket
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {filteredRequests.map((request) => {
                    const UserTypeIcon = getUserTypeIcon(request.userType);
                    return (
                      <tr key={request.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-100">{request.subject}</p>
                            <p className="text-sm text-gray-400">#{request.ticketNumber}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserTypeIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <div>
                              <p className="text-sm font-medium text-gray-100">{request.userName}</p>
                              <p className="text-sm text-gray-400 capitalize">{request.userType}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300 capitalize">
                            {request.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                            {request.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {request.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setSelectedRequest(request);
                                setActiveTab('chat');
                              }}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              View
                            </button>
                            <Menu as="div" className="relative inline-block text-left">
                              <Menu.Button className="text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                                <EllipsisVerticalIcon className="h-4 w-4" />
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                              >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                  <div className="py-1">
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => updateRequestStatus(request.id, 'in-progress')}
                                          className={`${
                                            active ? 'bg-gray-600' : ''
                                          } block px-4 py-2 text-sm text-gray-300 w-full text-left`}
                                        >
                                          Mark In Progress
                                        </button>
                                      )}
                                    </Menu.Item>
                                    <Menu.Item>
                                      {({ active }) => (
                                        <button
                                          onClick={() => updateRequestStatus(request.id, 'resolved')}
                                          className={`${
                                            active ? 'bg-gray-600' : ''
                                          } block px-4 py-2 text-sm text-gray-300 w-full text-left`}
                                        >
                                          Mark Resolved
                                        </button>
                                      )}
                                    </Menu.Item>
                                  </div>
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-700">
                  <h3 className="text-lg font-medium text-gray-100">Active Tickets</h3>
                </div>
                <ul role="list" className="divide-y divide-gray-700 max-h-96 overflow-y-auto">
                  {filteredRequests.filter(r => r.status !== 'closed').map((request) => (
                    <li 
                      key={request.id} 
                      className={`px-6 py-4 hover:bg-gray-700/50 cursor-pointer ${
                        selectedRequest?.id === request.id ? 'bg-purple-900/50 border-r-2 border-purple-500' : ''
                      }`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-100 truncate">
                            {request.subject}
                          </p>
                          <p className="text-sm text-gray-400">{request.userName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                              {request.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              {selectedRequest ? (
                <div className="bg-gray-800 shadow rounded-lg">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-100">{selectedRequest.subject}</h3>
                        <p className="text-sm text-gray-400">
                          {selectedRequest.userName} • #{selectedRequest.ticketNumber}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedRequest.status)}`}>
                          {selectedRequest.status}
                        </span>
                        <Menu as="div" className="relative inline-block text-left">
                          <Menu.Button className="text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg">
                            <EllipsisVerticalIcon className="h-4 w-4" />
                          </Menu.Button>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-700 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => updateRequestStatus(selectedRequest.id, 'in-progress')}
                                      className={`${
                                        active ? 'bg-gray-600' : ''
                                      } block px-4 py-2 text-sm text-gray-300 w-full text-left`}
                                    >
                                      Mark In Progress
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={() => updateRequestStatus(selectedRequest.id, 'resolved')}
                                      className={`${
                                        active ? 'bg-gray-600' : ''
                                      } block px-4 py-2 text-sm text-gray-300 w-full text-left`}
                                    >
                                      Mark Resolved
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="h-96 overflow-y-auto space-y-4">
                      {selectedRequest.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender === 'admin' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'admin'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-100'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs opacity-75">{message.senderName}</p>
                              <p className="text-xs opacity-75">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="mt-4">
                      <div className="flex gap-x-4">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your response..."
                          className="flex-1 px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="rounded-md bg-purple-600 p-2 text-white shadow-sm hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                        >
                          <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800 shadow rounded-lg p-6">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-500" />
                    <h3 className="mt-2 text-sm font-medium text-gray-100">No ticket selected</h3>
                    <p className="mt-1 text-sm text-gray-400">
                      Select a ticket from the list to start chatting with the user.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 