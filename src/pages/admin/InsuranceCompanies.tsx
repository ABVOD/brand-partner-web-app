import { useState } from 'react';
import {
  BuildingOfficeIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PhoneIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

interface InsuranceCompany {
  id: string;
  name: string;
  licenseNumber: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  type: 'auto' | 'health' | 'property' | 'life' | 'commercial' | 'umbrella';
  headquarters: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
    claimsPhone: string;
    claimsEmail: string;
  };
  apiIntegration: {
    isIntegrated: boolean;
    apiKey?: string;
    lastSync?: string;
    endpoint?: string;
    status: 'connected' | 'disconnected' | 'error';
  };
  coverage: {
    states: string[];
    minimumCoverage: number;
    maximumCoverage: number;
    accidentTypes: string[];
  };
  performance: {
    totalClaims: number;
    averageProcessingTime: number; // in hours
    approvalRate: number; // percentage
    customerSatisfaction: number; // rating out of 5
  };
  financialInfo: {
    amRating: string;
    assets: number;
    yearEstablished: number;
  };
  createdAt: string;
  lastUpdated: string;
}

export default function InsuranceCompanies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState<InsuranceCompany | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock data - in a real app, this would come from your backend
  const insuranceCompanies: InsuranceCompany[] = [
    {
      id: '1',
      name: 'State Farm Insurance',
      licenseNumber: 'SF-2024-001',
      status: 'active',
      type: 'auto',
      headquarters: {
        address: '1 State Farm Plaza',
        city: 'Bloomington',
        state: 'Illinois',
        zipCode: '61710',
        country: 'USA'
      },
      contact: {
        phone: '+1-800-STATE-FARM',
        email: 'contact@statefarm.com',
        website: 'https://www.statefarm.com',
        claimsPhone: '+1-800-SF-CLAIM',
        claimsEmail: 'claims@statefarm.com'
      },
      apiIntegration: {
        isIntegrated: true,
        apiKey: 'sf_api_key_***',
        lastSync: '2024-01-21T10:30:00Z',
        endpoint: 'https://api.statefarm.com/v1',
        status: 'connected'
      },
      coverage: {
        states: ['IL', 'CA', 'TX', 'FL', 'NY', 'OH'],
        minimumCoverage: 25000,
        maximumCoverage: 1000000,
        accidentTypes: ['Auto', 'Property', 'Personal Injury']
      },
      performance: {
        totalClaims: 1247,
        averageProcessingTime: 24,
        approvalRate: 89.5,
        customerSatisfaction: 4.2
      },
      financialInfo: {
        amRating: 'A++',
        assets: 126500000000,
        yearEstablished: 1922
      },
      createdAt: '2024-01-01T00:00:00Z',
      lastUpdated: '2024-01-21T10:30:00Z'
    },
    {
      id: '2',
      name: 'Progressive Insurance',
      licenseNumber: 'PG-2024-002',
      status: 'active',
      type: 'auto',
      headquarters: {
        address: '6300 Wilson Mills Rd',
        city: 'Mayfield Village',
        state: 'Ohio',
        zipCode: '44143',
        country: 'USA'
      },
      contact: {
        phone: '+1-800-PROGRESSIVE',
        email: 'info@progressive.com',
        website: 'https://www.progressive.com',
        claimsPhone: '+1-800-274-4499',
        claimsEmail: 'claims@progressive.com'
      },
      apiIntegration: {
        isIntegrated: true,
        apiKey: 'pg_api_key_***',
        lastSync: '2024-01-21T09:15:00Z',
        endpoint: 'https://api.progressive.com/v2',
        status: 'connected'
      },
      coverage: {
        states: ['OH', 'CA', 'TX', 'FL', 'PA', 'MI'],
        minimumCoverage: 30000,
        maximumCoverage: 2000000,
        accidentTypes: ['Auto', 'Motorcycle', 'Commercial Vehicle']
      },
      performance: {
        totalClaims: 986,
        averageProcessingTime: 18,
        approvalRate: 92.1,
        customerSatisfaction: 4.4
      },
      financialInfo: {
        amRating: 'A+',
        assets: 89200000000,
        yearEstablished: 1937
      },
      createdAt: '2024-01-05T00:00:00Z',
      lastUpdated: '2024-01-21T09:15:00Z'
    },
    {
      id: '3',
      name: 'Geico Insurance',
      licenseNumber: 'GC-2024-003',
      status: 'active',
      type: 'auto',
      headquarters: {
        address: '1 GEICO Plaza',
        city: 'Chevy Chase',
        state: 'Maryland',
        zipCode: '20815',
        country: 'USA'
      },
      contact: {
        phone: '+1-800-GEICO-24',
        email: 'customerservice@geico.com',
        website: 'https://www.geico.com',
        claimsPhone: '+1-800-841-3000',
        claimsEmail: 'claims@geico.com'
      },
      apiIntegration: {
        isIntegrated: true,
        apiKey: 'gc_api_key_***',
        lastSync: '2024-01-21T08:45:00Z',
        endpoint: 'https://api.geico.com/v1',
        status: 'connected'
      },
      coverage: {
        states: ['MD', 'VA', 'DC', 'CA', 'TX', 'FL'],
        minimumCoverage: 25000,
        maximumCoverage: 1500000,
        accidentTypes: ['Auto', 'Property', 'Renters']
      },
      performance: {
        totalClaims: 1103,
        averageProcessingTime: 22,
        approvalRate: 87.8,
        customerSatisfaction: 4.1
      },
      financialInfo: {
        amRating: 'A++',
        assets: 95400000000,
        yearEstablished: 1936
      },
      createdAt: '2024-01-10T00:00:00Z',
      lastUpdated: '2024-01-21T08:45:00Z'
    },
    {
      id: '4',
      name: 'Allstate Insurance',
      licenseNumber: 'AS-2024-004',
      status: 'pending',
      type: 'auto',
      headquarters: {
        address: '2775 Sanders Rd',
        city: 'Northbrook',
        state: 'Illinois',
        zipCode: '60062',
        country: 'USA'
      },
      contact: {
        phone: '+1-800-ALLSTATE',
        email: 'contact@allstate.com',
        website: 'https://www.allstate.com',
        claimsPhone: '+1-800-54-CLAIMS',
        claimsEmail: 'claims@allstate.com'
      },
      apiIntegration: {
        isIntegrated: false,
        status: 'disconnected'
      },
      coverage: {
        states: ['IL', 'IN', 'WI', 'MI', 'OH'],
        minimumCoverage: 25000,
        maximumCoverage: 1000000,
        accidentTypes: ['Auto', 'Home', 'Life']
      },
      performance: {
        totalClaims: 0,
        averageProcessingTime: 0,
        approvalRate: 0,
        customerSatisfaction: 0
      },
      financialInfo: {
        amRating: 'A+',
        assets: 78900000000,
        yearEstablished: 1931
      },
      createdAt: '2024-01-20T00:00:00Z',
      lastUpdated: '2024-01-20T00:00:00Z'
    }
  ];

  const filteredCompanies = insuranceCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.headquarters.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
    const matchesType = filterType === 'all' || company.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusUpdate = (companyId: string, newStatus: string) => {
    console.log(`Updating company ${companyId} to status: ${newStatus}`);
    // In a real app, this would make an API call
  };

  const handleDelete = (companyId: string) => {
    if (confirm('Are you sure you want to delete this insurance company?')) {
      console.log(`Deleting company ${companyId}`);
      // In a real app, this would make an API call
    }
  };

  const openCompanyDetails = (company: InsuranceCompany) => {
    setSelectedCompany(company);
    setShowDetailModal(true);
  };

  const openEditModal = (company: InsuranceCompany) => {
    setSelectedCompany(company);
    setShowEditModal(true);
  };

  const exportData = () => {
    console.log('Exporting insurance companies data...');
    // In a real app, this would generate and download a CSV/Excel file
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600/50 text-gray-300">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Inactive
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Suspended
          </span>
        );
      default:
        return null;
    }
  };

  const getApiStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Connected
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600/50 text-gray-300">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Disconnected
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-300">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Error
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Insurance Companies</h1>
            <p className="text-gray-400 mt-1">Manage insurance provider integrations and partnerships</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Company
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-900/50 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">
                  {insuranceCompanies.filter(c => c.status === 'active').length}
                </p>
                <p className="text-sm text-gray-400">Active</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-900/50 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">
                  {insuranceCompanies.filter(c => c.apiIntegration.isIntegrated).length}
                </p>
                <p className="text-sm text-gray-400">Integrated</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-900/50 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-purple-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">
                  {insuranceCompanies.reduce((sum, c) => sum + c.performance.totalClaims, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Total Claims</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-900/50 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-2xl font-bold text-gray-100">
                  {(insuranceCompanies.reduce((sum, c) => sum + c.performance.approvalRate, 0) / insuranceCompanies.length).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-400">Avg Approval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="auto">Auto</option>
                <option value="health">Health</option>
                <option value="property">Property</option>
                <option value="life">Life</option>
                <option value="commercial">Commercial</option>
                <option value="umbrella">Umbrella</option>
              </select>
            </div>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-gray-800 rounded-lg border border-gray-700 p-6 hover:border-purple-600/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-900/50 rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">{company.name}</h3>
                    <p className="text-sm text-gray-400">{company.licenseNumber}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(company.status)}
                  {getApiStatusBadge(company.apiIntegration.status)}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-gray-100 capitalize">{company.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Claims:</span>
                  <span className="text-gray-100">{company.performance.totalClaims.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Approval Rate:</span>
                  <span className="text-gray-100">{company.performance.approvalRate}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Avg Processing:</span>
                  <span className="text-gray-100">{company.performance.averageProcessingTime}h</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Coverage States:</span>
                  <span className="text-gray-100">{company.coverage.states.length} states</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{company.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openCompanyDetails(company)}
                    className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => openEditModal(company)}
                    className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700 rounded-lg"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-100">No insurance companies found</h3>
            <p className="mt-1 text-sm text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Company Details Modal */}
        {showDetailModal && selectedCompany && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
              <div className="relative w-full max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-100">Company Details</h3>
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-6">
                    {/* Company Header */}
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-900/50 rounded-lg">
                        <BuildingOfficeIcon className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-100">{selectedCompany.name}</h4>
                        <p className="text-gray-400">{selectedCompany.licenseNumber}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          {getStatusBadge(selectedCompany.status)}
                          {getApiStatusBadge(selectedCompany.apiIntegration.status)}
                        </div>
                      </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-300">Contact Information</h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                          <div className="flex items-center space-x-2">
                            <PhoneIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-100">{selectedCompany.contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-100">{selectedCompany.contact.website}</span>
                          </div>
                          <div className="text-sm text-gray-400">
                            Claims: {selectedCompany.contact.claimsPhone}
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-300">Performance</h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Claims:</span>
                            <span className="text-gray-100">{selectedCompany.performance.totalClaims.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Approval Rate:</span>
                            <span className="text-gray-100">{selectedCompany.performance.approvalRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Avg Processing:</span>
                            <span className="text-gray-100">{selectedCompany.performance.averageProcessingTime}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Satisfaction:</span>
                            <span className="text-gray-100">{selectedCompany.performance.customerSatisfaction}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Information */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-300 mb-2">Coverage Details</h5>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-gray-400">Coverage Range:</span>
                            <p className="text-gray-100">
                              {formatCurrency(selectedCompany.coverage.minimumCoverage)} - {formatCurrency(selectedCompany.coverage.maximumCoverage)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-400">States:</span>
                            <p className="text-gray-100">{selectedCompany.coverage.states.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-gray-700 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => openEditModal(selectedCompany)}
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      Edit Company
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