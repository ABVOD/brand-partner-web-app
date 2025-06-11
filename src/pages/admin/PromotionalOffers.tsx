import React, { useState, useMemo } from 'react';
import {
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  CheckCircleIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  TagIcon,
  BuildingStorefrontIcon,
  ClockIcon,
  SparklesIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

// Enhanced mock data for promotional offers
const mockPromotionalOffers = [
  {
    id: '1',
    campaignName: 'Summer Coffee Blast',
    brandName: 'Starbucks',
    brandId: 'starbucks-001',
    status: 'active',
    offerDetails: '50% off all iced coffee drinks + Free size upgrade',
    couponCode: 'SUMMER50',
    location: {
      address: 'Downtown Seattle, WA',
      lat: 47.6062,
      lng: -122.3321,
      radius: 1000,
      city: 'Seattle',
      state: 'WA'
    },
    dateRange: {
      startDate: new Date('2024-06-01'),
      endDate: new Date('2024-08-31')
    },
    adSpend: {
      totalBudget: 5000,
      spent: 3240,
      dailyBudget: 150,
      cpm: 12.50
    },
    performance: {
      impressions: 245000,
      clicks: 12250,
      redemptions: 1890,
      viewCount: 245000,
      clickThroughRate: 5.0,
      redemptionRate: 15.4
    },
    targetAudience: {
      ageRange: '18-45',
      interests: ['Coffee', 'Food & Beverage', 'Urban Lifestyle']
    },
    createdAt: new Date('2024-05-15'),
    lastModified: new Date('2024-07-02')
  },
  {
    id: '2',
    campaignName: 'Big Mac Monday',
    brandName: 'McDonald\'s',
    brandId: 'mcdonalds-002',
    status: 'active',
    offerDetails: 'Buy one Big Mac, get one free every Monday',
    couponCode: 'BIGMAC2',
    location: {
      address: 'Times Square, New York, NY',
      lat: 40.7580,
      lng: -73.9855,
      radius: 500,
      city: 'New York',
      state: 'NY'
    },
    dateRange: {
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-12-31')
    },
    adSpend: {
      totalBudget: 8000,
      spent: 2100,
      dailyBudget: 200,
      cpm: 15.00
    },
    performance: {
      impressions: 140000,
      clicks: 8400,
      redemptions: 980,
      viewCount: 140000,
      clickThroughRate: 6.0,
      redemptionRate: 11.7
    },
    targetAudience: {
      ageRange: '25-55',
      interests: ['Fast Food', 'Lunch Deals', 'Urban Dining']
    },
    createdAt: new Date('2024-06-20'),
    lastModified: new Date('2024-07-01')
  },
  {
    id: '3',
    campaignName: 'Weekend Flash Sale',
    brandName: 'Target',
    brandId: 'target-003',
    status: 'scheduled',
    offerDetails: '30% off electronics + Free shipping',
    couponCode: 'WEEKEND30',
    location: {
      address: 'Los Angeles Metropolitan Area, CA',
      lat: 34.0522,
      lng: -118.2437,
      radius: 5000,
      city: 'Los Angeles',
      state: 'CA'
    },
    dateRange: {
      startDate: new Date('2024-08-10'),
      endDate: new Date('2024-08-12')
    },
    adSpend: {
      totalBudget: 3500,
      spent: 0,
      dailyBudget: 1166,
      cpm: 18.00
    },
    performance: {
      impressions: 0,
      clicks: 0,
      redemptions: 0,
      viewCount: 0,
      clickThroughRate: 0,
      redemptionRate: 0
    },
    targetAudience: {
      ageRange: '18-65',
      interests: ['Electronics', 'Shopping', 'Technology']
    },
    createdAt: new Date('2024-07-25'),
    lastModified: new Date('2024-07-25')
  },
  {
    id: '4',
    campaignName: 'Pizza Night Special',
    brandName: 'Pizza Hut',
    brandId: 'pizzahut-004',
    status: 'completed',
    offerDetails: 'Large pizza for $12.99 after 6 PM',
    couponCode: 'NIGHT12',
    location: {
      address: 'Chicago Downtown, IL',
      lat: 41.8781,
      lng: -87.6298,
      radius: 2000,
      city: 'Chicago',
      state: 'IL'
    },
    dateRange: {
      startDate: new Date('2024-05-01'),
      endDate: new Date('2024-05-31')
    },
    adSpend: {
      totalBudget: 4200,
      spent: 4200,
      dailyBudget: 135,
      cpm: 10.50
    },
    performance: {
      impressions: 400000,
      clicks: 16000,
      redemptions: 2240,
      viewCount: 400000,
      clickThroughRate: 4.0,
      redemptionRate: 14.0
    },
    targetAudience: {
      ageRange: '20-50',
      interests: ['Pizza', 'Dinner', 'Family Dining']
    },
    createdAt: new Date('2024-04-15'),
    lastModified: new Date('2024-05-31')
  },
  {
    id: '5',
    campaignName: 'Back to School Sale',
    brandName: 'Best Buy',
    brandId: 'bestbuy-005',
    status: 'paused',
    offerDetails: '20% off laptops and electronics for students',
    couponCode: 'STUDENT20',
    location: {
      address: 'Boston University Area, MA',
      lat: 42.3505,
      lng: -71.1054,
      radius: 1500,
      city: 'Boston',
      state: 'MA'
    },
    dateRange: {
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-09-15')
    },
    adSpend: {
      totalBudget: 6000,
      spent: 1800,
      dailyBudget: 180,
      cpm: 22.00
    },
    performance: {
      impressions: 81800,
      clicks: 2450,
      redemptions: 340,
      viewCount: 81800,
      clickThroughRate: 3.0,
      redemptionRate: 13.9
    },
    targetAudience: {
      ageRange: '18-25',
      interests: ['Electronics', 'Education', 'Technology', 'Students']
    },
    createdAt: new Date('2024-07-15'),
    lastModified: new Date('2024-08-05')
  }
];

type FilterStatus = 'all' | 'active' | 'scheduled' | 'completed' | 'paused';

export default function PromotionalOffers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [sortBy, setSortBy] = useState<'name' | 'spend' | 'performance' | 'date'>('date');

  const filteredAndSortedOffers = useMemo(() => {
    let filtered = mockPromotionalOffers.filter(offer => {
      const matchesSearch = offer.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.location.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.campaignName.localeCompare(b.campaignName);
        case 'spend':
          return b.adSpend.spent - a.adSpend.spent;
        case 'performance':
          return b.performance.redemptions - a.performance.redemptions;
        case 'date':
        default:
          return b.lastModified.getTime() - a.lastModified.getTime();
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200', 
          icon: SparklesIcon,
          label: 'Active'
        };
      case 'scheduled':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200', 
          icon: ClockIcon,
          label: 'Scheduled'
        };
      case 'completed':
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: CheckCircleIcon,
          label: 'Completed'
        };
      case 'paused':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
          icon: ExclamationTriangleIcon,
          label: 'Paused'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          icon: ClockIcon,
          label: 'Unknown'
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatRadius = (radius: number) => {
    if (radius >= 1000) {
      return `${(radius / 1000).toFixed(1)} km`;
    }
    return `${radius} m`;
  };

  const calculateDaysRunning = (startDate: Date, endDate: Date, status: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (status === 'scheduled') {
      const daysUntilStart = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `Starts in ${daysUntilStart} days`;
    } else if (status === 'completed') {
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return `Ran for ${totalDays} days`;
    } else {
      const daysRunning = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return `Day ${daysRunning} of ${totalDays}`;
    }
  };

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const activeOffers = mockPromotionalOffers.filter(offer => offer.status === 'active');
    const totalSpend = mockPromotionalOffers.reduce((sum, offer) => sum + offer.adSpend.spent, 0);
    const totalImpressions = mockPromotionalOffers.reduce((sum, offer) => sum + offer.performance.impressions, 0);
    const totalRedemptions = mockPromotionalOffers.reduce((sum, offer) => sum + offer.performance.redemptions, 0);

    return {
      activeOffers: activeOffers.length,
      totalSpend,
      totalImpressions,
      totalRedemptions,
      avgRedemptionRate: totalImpressions > 0 ? (totalRedemptions / totalImpressions * 100) : 0
    };
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Promotional Offers</h1>
            <p className="mt-2 text-gray-600">
              Monitor and manage all brand promotional campaigns and ad spending
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-green-50 p-3">
                  <SparklesIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Active Offers</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.activeOffers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-blue-50 p-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Ad Spend</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summaryStats.totalSpend)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-purple-50 p-3">
                  <EyeIcon className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(summaryStats.totalImpressions)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-orange-50 p-3">
                  <CheckCircleIcon className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Total Redemptions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(summaryStats.totalRedemptions)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-red-50 p-3">
                  <ChartBarIcon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">Avg. Redemption Rate</p>
                <p className="text-2xl font-bold text-gray-900">{summaryStats.avgRedemptionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search campaigns, brands, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="date">Last Modified</option>
                <option value="name">Campaign Name</option>
                <option value="spend">Ad Spend</option>
                <option value="performance">Performance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Offers List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Promotional Campaigns ({filteredAndSortedOffers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAndSortedOffers.map((offer) => {
              const statusConfig = getStatusConfig(offer.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={offer.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-lg bg-gray-100 p-2">
                            <TagIcon className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{offer.campaignName}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <BuildingStorefrontIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{offer.brandName}</span>
                              <span className="text-gray-300">•</span>
                              <span className="text-sm text-gray-500">ID: {offer.brandId}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`inline-flex items-center space-x-2 rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span>{statusConfig.label}</span>
                        </div>
                      </div>

                      {/* Offer Details */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <TagIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-900">Offer Details</p>
                            <p className="text-sm text-blue-800 mt-1">{offer.offerDetails}</p>
                            {offer.couponCode && (
                              <div className="mt-2 inline-flex items-center space-x-2 bg-blue-100 rounded-md px-2 py-1">
                                <span className="text-xs font-medium text-blue-900">Code:</span>
                                <span className="text-xs font-mono text-blue-800">{offer.couponCode}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Location and Range */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <MapPinIcon className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-900">Location & Range</p>
                              <p className="text-sm text-green-800 mt-1">{offer.location.address}</p>
                              <div className="mt-2 flex items-center space-x-4 text-xs text-green-700">
                                <span>Radius: {formatRadius(offer.location.radius)}</span>
                                <span>•</span>
                                <span>Lat: {offer.location.lat.toFixed(4)}</span>
                                <span>•</span>
                                <span>Lng: {offer.location.lng.toFixed(4)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <CalendarIcon className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-purple-900">Campaign Period</p>
                              <p className="text-sm text-purple-800 mt-1">
                                {offer.dateRange.startDate.toLocaleDateString()} - {offer.dateRange.endDate.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-purple-700 mt-1">
                                {calculateDaysRunning(offer.dateRange.startDate, offer.dateRange.endDate, offer.status)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ad Spend Details */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <CurrencyDollarIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-900">Ad Spend & Budget</p>
                            <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-yellow-700">Total Spent</p>
                                <p className="text-lg font-bold text-yellow-900">{formatCurrency(offer.adSpend.spent)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-yellow-700">Total Budget</p>
                                <p className="text-lg font-bold text-yellow-900">{formatCurrency(offer.adSpend.totalBudget)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-yellow-700">Daily Budget</p>
                                <p className="text-lg font-bold text-yellow-900">{formatCurrency(offer.adSpend.dailyBudget)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-yellow-700">CPM Rate</p>
                                <p className="text-lg font-bold text-yellow-900">{formatCurrency(offer.adSpend.cpm)}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-yellow-700">Budget Usage</span>
                                <span className="text-xs text-yellow-800 font-medium">
                                  {((offer.adSpend.spent / offer.adSpend.totalBudget) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-yellow-200 rounded-full h-2">
                                <div 
                                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min((offer.adSpend.spent / offer.adSpend.totalBudget) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <ChartBarIcon className="h-5 w-5 text-gray-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">Performance Metrics</p>
                            <div className="mt-3 grid grid-cols-2 lg:grid-cols-5 gap-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900">
                                  <EyeIcon className="h-4 w-4 text-blue-500" />
                                  <span>{formatNumber(offer.performance.impressions)}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Impressions</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900">
                                  <CursorArrowRaysIcon className="h-4 w-4 text-green-500" />
                                  <span>{formatNumber(offer.performance.clicks)}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Clicks</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-900">
                                  <CheckCircleIcon className="h-4 w-4 text-purple-500" />
                                  <span>{formatNumber(offer.performance.redemptions)}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">Redemptions</p>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{offer.performance.clickThroughRate.toFixed(1)}%</div>
                                <p className="text-xs text-gray-600 mt-1">CTR</p>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{offer.performance.redemptionRate.toFixed(1)}%</div>
                                <p className="text-xs text-gray-600 mt-1">Redemption Rate</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Target Audience */}
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <EyeIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-indigo-900">Target Audience</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                                Age: {offer.targetAudience.ageRange}
                              </span>
                              {offer.targetAudience.interests.map((interest, index) => (
                                <span key={index} className="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
                        <span>Created: {offer.createdAt.toLocaleDateString()}</span>
                        <span>Last Modified: {offer.lastModified.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredAndSortedOffers.length === 0 && (
              <div className="text-center py-12">
                <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No promotional offers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Brand partners haven\'t created any promotional offers yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
} 