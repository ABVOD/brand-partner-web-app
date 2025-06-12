import { useState } from 'react';
import {
  ExclamationTriangleIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  PhotoIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

interface IncidentReport {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'investigating' | 'resolved' | 'false_alarm';
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  images: string[];
  actionsTaken: string;
  assignedTo?: string;
  resolvedAt?: string;
}

export default function IncidentReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<IncidentReport | null>(null);
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Mock data - in a real app, this would come from your backend
  const incidents: IncidentReport[] = [
    {
      id: '1',
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@example.com',
      title: 'Car accident at intersection',
      description: 'Two vehicle collision at the main intersection. One person injured, ambulance called.',
      severity: 'high',
      status: 'investigating',
      timestamp: '2024-01-20T14:30:00Z',
      location: {
        latitude: 40.7831,
        longitude: -73.9712,
        address: '5th Ave & E 59th St, New York, NY 10019'
      },
      images: ['accident1.jpg', 'accident2.jpg'],
      actionsTaken: 'Emergency services contacted. Police report filed. Witnesses identified.',
      assignedTo: 'Officer Johnson'
    },
    {
      id: '2',
      userId: '3',
      userName: 'Mike Johnson',
      userEmail: 'mike.johnson@example.com',
      title: 'Suspicious activity in parking lot',
      description: 'Observed suspicious individuals in the mall parking lot. Possible break-in attempt.',
      severity: 'medium',
      status: 'pending',
      timestamp: '2024-01-20T16:15:00Z',
      location: {
        latitude: 41.8781,
        longitude: -87.6298,
        address: 'Westfield Chicago Ridge, Chicago, IL 60415'
      },
      images: ['suspicious1.jpg'],
      actionsTaken: 'Initial report filed. Awaiting security review.',
      assignedTo: 'Security Team Alpha'
    },
    {
      id: '3',
      userId: '4',
      userName: 'Sarah Wilson',
      userEmail: 'sarah.wilson@example.com',
      title: 'Medical emergency',
      description: 'Person collapsed in shopping center. CPR administered.',
      severity: 'critical',
      status: 'resolved',
      timestamp: '2024-01-19T11:45:00Z',
      location: {
        latitude: 29.7604,
        longitude: -95.3698,
        address: 'Galleria Mall, Houston, TX 77056'
      },
      images: [],
      actionsTaken: 'Paramedics arrived and transported patient. Full recovery reported.',
      assignedTo: 'EMT Unit 7',
      resolvedAt: '2024-01-19T12:30:00Z'
    }
  ];

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || incident.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || incident.status === filterStatus;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleStatusUpdate = (incidentId: string, newStatus: string) => {
    console.log(`Updating incident ${incidentId} to status: ${newStatus}`);
    // In a real app, this would make an API call
  };

  const openIncidentDetails = (incident: IncidentReport) => {
    setSelectedIncident(incident);
    setShowIncidentModal(true);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
            Low
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
            Medium
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-900/50 text-orange-300">
            High
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
            Critical
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600/50 text-gray-300">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Investigating
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
            <CheckIcon className="h-3 w-3 mr-1" />
            Resolved
          </span>
        );
      case 'false_alarm':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/50 text-purple-300">
            <XMarkIcon className="h-3 w-3 mr-1" />
            False Alarm
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Incident Reports</h1>
          <p className="text-gray-400 mt-1">Monitor and manage security incidents and emergency reports</p>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="false_alarm">False Alarm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-red-600/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-100">{incident.title}</h3>
                    {getSeverityBadge(incident.severity)}
                    {getStatusBadge(incident.status)}
                  </div>

                  <p className="text-gray-400 mb-4">{incident.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span>{incident.userName}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{formatTimestamp(incident.timestamp)}</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      <span className="truncate">{incident.location.address}</span>
                    </div>
                  </div>

                  {incident.assignedTo && (
                    <div className="mt-2 text-sm text-gray-400">
                      <span className="font-medium">Assigned to:</span> {incident.assignedTo}
                    </div>
                  )}

                  {incident.images.length > 0 && (
                    <div className="mt-2 flex items-center text-gray-400">
                      <PhotoIcon className="h-4 w-4 mr-2" />
                      <span>{incident.images.length} image{incident.images.length === 1 ? '' : 's'} attached</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openIncidentDetails(incident)}
                    className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  
                  {incident.status === 'pending' && (
                    <button
                      onClick={() => handleStatusUpdate(incident.id, 'investigating')}
                      className="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-900/50 rounded-full hover:bg-blue-800/50"
                    >
                      Start Investigation
                    </button>
                  )}
                  
                  {incident.status === 'investigating' && (
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleStatusUpdate(incident.id, 'resolved')}
                        className="px-3 py-1 text-xs font-medium text-green-300 bg-green-900/50 rounded-full hover:bg-green-800/50"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(incident.id, 'false_alarm')}
                        className="px-3 py-1 text-xs font-medium text-purple-300 bg-purple-900/50 rounded-full hover:bg-purple-800/50"
                      >
                        False Alarm
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredIncidents.length === 0 && (
          <div className="text-center py-12">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-100">No incidents found</h3>
            <p className="mt-1 text-sm text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Incident Details Modal */}
        {showIncidentModal && selectedIncident && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowIncidentModal(false)}></div>
              <div className="relative w-full max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-100">Incident Details</h3>
                      <button
                        onClick={() => setShowIncidentModal(false)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-6">
                    {/* Header Info */}
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-xl font-semibold text-gray-100">{selectedIncident.title}</h4>
                        {getSeverityBadge(selectedIncident.severity)}
                        {getStatusBadge(selectedIncident.status)}
                      </div>
                      <p className="text-gray-400">{selectedIncident.description}</p>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Reporter Info */}
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-300">Reporter Information</h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-100">{selectedIncident.userName}</span>
                          </div>
                          <div className="text-sm text-gray-400">{selectedIncident.userEmail}</div>
                        </div>
                      </div>

                      {/* Timing */}
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-300">Timeline</h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-100">{formatTimestamp(selectedIncident.timestamp)}</span>
                          </div>
                          {selectedIncident.resolvedAt && (
                            <div className="flex items-center space-x-2">
                              <CheckIcon className="h-4 w-4 text-green-400" />
                              <span className="text-gray-100">Resolved: {formatTimestamp(selectedIncident.resolvedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-300">Location</h5>
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-start space-x-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              <div className="text-gray-100">{selectedIncident.location.address}</div>
                              <div className="text-sm text-gray-400">
                                {selectedIncident.location.latitude.toFixed(6)}, {selectedIncident.location.longitude.toFixed(6)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assignment */}
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-300">Assignment</h5>
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="text-gray-100">
                            {selectedIncident.assignedTo || 'Unassigned'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions Taken */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Actions Taken</h5>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <p className="text-gray-100">{selectedIncident.actionsTaken}</p>
                      </div>
                    </div>

                    {/* Images */}
                    {selectedIncident.images.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Attached Images</h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedIncident.images.map((image, index) => (
                            <div key={index} className="bg-gray-700 rounded-lg p-4 text-center">
                              <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <div className="text-xs text-gray-400">{image}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowIncidentModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                      Update Status
                    </button>
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