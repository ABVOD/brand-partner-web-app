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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Low
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Medium
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            High
          </span>
        );
      case 'critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'investigating':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Investigating
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckIcon className="h-3 w-3 mr-1" />
            Resolved
          </span>
        );
      case 'false_alarm':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
            <p className="mt-1 text-gray-600">Monitor and manage accident reports and safety incidents</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                <span className="text-sm font-medium text-gray-900">{filteredIncidents.length}</span>
                <span className="text-sm text-gray-500">incidents</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {incidents.filter(i => i.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {incidents.filter(i => i.status === 'investigating').length}
                </p>
                <p className="text-sm text-gray-600">Investigating</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {incidents.filter(i => i.status === 'resolved').length}
                </p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-900">
                  {incidents.filter(i => i.severity === 'critical' || i.severity === 'high').length}
                </p>
                <p className="text-sm text-gray-600">High Priority</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, reporter, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Severity Filter */}
            <div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="false_alarm">False Alarm</option>
              </select>
            </div>
          </div>
        </div>

        {/* Incidents Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Incident
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                        <div className="text-sm text-gray-500 mt-1 max-w-xs truncate">{incident.description}</div>
                        {incident.images.length > 0 && (
                          <div className="flex items-center mt-2">
                            <PhotoIcon className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-xs text-gray-500">{incident.images.length} image(s)</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{incident.userName}</div>
                          <div className="text-sm text-gray-500">{incident.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSeverityBadge(incident.severity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(incident.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-1" />
                        {formatTimestamp(incident.timestamp)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500 max-w-xs truncate">{incident.location.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openIncidentDetails(incident)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => window.open(`https://maps.google.com/?q=${incident.location.latitude},${incident.location.longitude}`, '_blank')}
                          className="text-blue-600 hover:text-blue-900"
                          title="View on Map"
                        >
                          <MapPinIcon className="h-4 w-4" />
                        </button>
                        {incident.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(incident.id, 'investigating')}
                            className="text-orange-600 hover:text-orange-900"
                            title="Start Investigation"
                          >
                            <ExclamationTriangleIcon className="h-4 w-4" />
                          </button>
                        )}
                        {incident.status === 'investigating' && (
                          <button
                            onClick={() => handleStatusUpdate(incident.id, 'resolved')}
                            className="text-green-600 hover:text-green-900"
                            title="Mark Resolved"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Incident Details Modal */}
        {showIncidentModal && selectedIncident && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Incident Details</h3>
                <button
                  onClick={() => setShowIncidentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Header Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Severity</label>
                    <div className="mt-1">{getSeverityBadge(selectedIncident.severity)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedIncident.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <p className="mt-1 text-sm text-gray-900">{formatTimestamp(selectedIncident.timestamp)}</p>
                  </div>
                </div>

                {/* Title and Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{selectedIncident.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedIncident.description}</p>
                </div>

                {/* Reporter and Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reporter</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{selectedIncident.userName}</p>
                          <p className="text-sm text-gray-500">{selectedIncident.userEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <MapPinIcon className="h-5 w-5 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-900">{selectedIncident.location.address}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedIncident.location.latitude}, {selectedIncident.location.longitude}
                          </p>
                          <button
                            onClick={() => window.open(`https://maps.google.com/?q=${selectedIncident.location.latitude},${selectedIncident.location.longitude}`, '_blank')}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                          >
                            View on Google Maps →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Taken */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Actions Taken</label>
                  <div className="mt-1 bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-900">{selectedIncident.actionsTaken}</p>
                    {selectedIncident.assignedTo && (
                      <p className="text-xs text-gray-600 mt-2">
                        Assigned to: <span className="font-medium">{selectedIncident.assignedTo}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Images */}
                {selectedIncident.images.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attached Images</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedIncident.images.map((image, index) => (
                        <div key={index} className="bg-gray-100 rounded-lg p-4 text-center">
                          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-xs text-gray-600">{image}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  {selectedIncident.status === 'pending' && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedIncident.id, 'investigating');
                        setShowIncidentModal(false);
                      }}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Start Investigation
                    </button>
                  )}
                  {selectedIncident.status === 'investigating' && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedIncident.id, 'resolved');
                        setShowIncidentModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark as Resolved
                    </button>
                  )}
                  <button
                    onClick={() => setShowIncidentModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
} 