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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Inactive
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Connected
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Disconnected
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Companies</h1>
            <p className="mt-2 text-gray-600">
              Manage insurance companies that partner with us to cover accidents
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={exportData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Company
            </button>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2">
                <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-900">{filteredCompanies.length}</span>
                <span className="text-sm text-gray-500">Companies</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Partners</p>
                <p className="text-2xl font-bold text-gray-900">
                  {insuranceCompanies.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900">
                  {insuranceCompanies.reduce((sum, c) => sum + c.performance.totalClaims, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GlobeAltIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">API Integrations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {insuranceCompanies.filter(c => c.apiIntegration.isIntegrated).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(insuranceCompanies.reduce((sum, c) => sum + c.performance.averageProcessingTime, 0) / insuranceCompanies.filter(c => c.performance.averageProcessingTime > 0).length)}h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies by name, license, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
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

        {/* Companies Table */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    API Integration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coverage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCompanies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                          <BuildingOfficeIcon className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.licenseNumber}</div>
                          <div className="text-xs text-gray-400">
                            {company.headquarters.city}, {company.headquarters.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(company.status)}
                        <div className="text-xs text-gray-500 capitalize">{company.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getApiStatusBadge(company.apiIntegration.status)}
                        {company.apiIntegration.lastSync && (
                          <div className="text-xs text-gray-500">
                            Last sync: {formatDate(company.apiIntegration.lastSync)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.performance.totalClaims} claims
                      </div>
                      <div className="text-xs text-gray-500">
                        {company.performance.averageProcessingTime}h avg • {company.performance.approvalRate}% approval
                      </div>
                      <div className="text-xs text-gray-500">
                        ⭐ {company.performance.customerSatisfaction}/5
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {company.coverage.states.length} states
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatCurrency(company.coverage.minimumCoverage)} - {formatCurrency(company.coverage.maximumCoverage)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {company.coverage.accidentTypes.length} accident types
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openCompanyDetails(company)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openEditModal(company)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedCompany && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDetailModal(false)}></div>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {selectedCompany.name} - Details
                    </h3>
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">License Number</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.licenseNumber}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <div className="mt-1">{getStatusBadge(selectedCompany.status)}</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Type</label>
                          <p className="mt-1 text-sm text-gray-900 capitalize">{selectedCompany.type}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Established</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.financialInfo.yearEstablished}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">AM Rating</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.financialInfo.amRating}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Contact Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Headquarters</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCompany.headquarters.address}<br/>
                            {selectedCompany.headquarters.city}, {selectedCompany.headquarters.state} {selectedCompany.headquarters.zipCode}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.contact.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.contact.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Website</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.contact.website}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Claims Contact</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCompany.contact.claimsPhone}<br/>
                            {selectedCompany.contact.claimsEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* API Integration */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">API Integration</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Status</label>
                          <div className="mt-1">{getApiStatusBadge(selectedCompany.apiIntegration.status)}</div>
                        </div>
                        {selectedCompany.apiIntegration.endpoint && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Endpoint</label>
                            <p className="mt-1 text-sm text-gray-900">{selectedCompany.apiIntegration.endpoint}</p>
                          </div>
                        )}
                        {selectedCompany.apiIntegration.lastSync && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Last Sync</label>
                            <p className="mt-1 text-sm text-gray-900">{formatDate(selectedCompany.apiIntegration.lastSync)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-900">Performance Metrics</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Total Claims</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.performance.totalClaims}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Average Processing Time</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.performance.averageProcessingTime} hours</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Approval Rate</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.performance.approvalRate}%</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Customer Satisfaction</label>
                          <p className="mt-1 text-sm text-gray-900">{selectedCompany.performance.customerSatisfaction}/5 ⭐</p>
                        </div>
                      </div>
                    </div>

                    {/* Coverage Information */}
                    <div className="space-y-4 md:col-span-2">
                      <h4 className="text-lg font-medium text-gray-900">Coverage Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Coverage Range</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatCurrency(selectedCompany.coverage.minimumCoverage)} - {formatCurrency(selectedCompany.coverage.maximumCoverage)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">States Covered</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCompany.coverage.states.join(', ')}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Accident Types</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {selectedCompany.coverage.accidentTypes.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
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