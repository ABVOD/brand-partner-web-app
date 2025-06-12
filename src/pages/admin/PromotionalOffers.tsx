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
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredOffers = useMemo(() => {
    return mockPromotionalOffers.filter(offer => {
      const matchesSearch = offer.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.location.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || offer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Active
            </span>
          ),
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-600/30'
        };
      case 'scheduled':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300">
              <ClockIcon className="h-3 w-3 mr-1" />
              Scheduled
            </span>
          ),
          bgColor: 'bg-blue-900/20',
          borderColor: 'border-blue-600/30'
        };
      case 'completed':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-600/50 text-gray-300">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Completed
            </span>
          ),
          bgColor: 'bg-gray-700/20',
          borderColor: 'border-gray-600/30'
        };
      case 'paused':
        return {
          badge: (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-300">
              <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
              Paused
            </span>
          ),
          bgColor: 'bg-yellow-900/20',
          borderColor: 'border-yellow-600/30'
        };
      default:
        return {
          badge: null,
          bgColor: 'bg-gray-700/20',
          borderColor: 'border-gray-600/30'
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
          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-green-900/50 p-3">
                  <SparklesIcon className="h-6 w-6 text-green-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">Active Offers</p>
                <p className="text-2xl font-bold text-gray-100">{summaryStats.activeOffers}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-blue-900/50 p-3">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">Total Ad Spend</p>
                <p className="text-2xl font-bold text-gray-100">{formatCurrency(summaryStats.totalSpend)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-purple-900/50 p-3">
                  <EyeIcon className="h-6 w-6 text-purple-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-100">{formatNumber(summaryStats.totalImpressions)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-orange-900/50 p-3">
                  <CheckCircleIcon className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">Total Redemptions</p>
                <p className="text-2xl font-bold text-gray-100">{formatNumber(summaryStats.totalRedemptions)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="rounded-lg bg-red-900/50 p-3">
                  <ChartBarIcon className="h-6 w-6 text-red-400" />
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-400">Avg. Redemption Rate</p>
                <p className="text-2xl font-bold text-gray-100">{summaryStats.avgRedemptionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-6">
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
                  className="pl-10 pr-4 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
                  className="pl-10 pr-8 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>


          </div>
        </div>

        {/* Offers List */}
        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-gray-100">
              Promotional Campaigns ({filteredOffers.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-700">
            {filteredOffers.map((offer: any) => {
              const statusConfig = getStatusConfig(offer.status);

              return (
                <div key={offer.id} className="p-6 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-lg bg-gray-700 p-2">
                            <TagIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-100">{offer.campaignName}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <BuildingStorefrontIcon className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-300">{offer.brandName}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-sm text-gray-400">ID: {offer.brandId}</span>
                            </div>
                          </div>
                        </div>
                        {statusConfig.badge}
                      </div>

                      {/* Offer Details */}
                      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <TagIcon className="h-5 w-5 text-blue-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-300">Offer Details</p>
                            <p className="text-sm text-blue-400 mt-1">{offer.offerDetails}</p>
                            {offer.couponCode && (
                              <div className="mt-2 inline-flex items-center space-x-2 bg-blue-800/50 rounded-md px-2 py-1">
                                <span className="text-xs font-medium text-blue-300">Code:</span>
                                <span className="text-xs font-mono text-blue-400">{offer.couponCode}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Location and Range */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <MapPinIcon className="h-5 w-5 text-green-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-300">Location & Range</p>
                              <p className="text-sm text-green-400 mt-1">{offer.location.address}</p>
                              <div className="mt-2 flex items-center space-x-4 text-xs text-green-500">
                                <span>Radius: {formatRadius(offer.location.radius)}</span>
                                <span>•</span>
                                <span>Lat: {offer.location.lat.toFixed(4)}</span>
                                <span>•</span>
                                <span>Lng: {offer.location.lng.toFixed(4)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <CalendarIcon className="h-5 w-5 text-purple-400 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-purple-300">Campaign Period</p>
                              <p className="text-sm text-purple-400 mt-1">
                                {offer.dateRange.startDate.toLocaleDateString()} - {offer.dateRange.endDate.toLocaleDateString()}
                              </p>
                              <p className="text-xs text-purple-500 mt-1">
                                {calculateDaysRunning(offer.dateRange.startDate, offer.dateRange.endDate, offer.status)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ad Spend Details */}
                      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <CurrencyDollarIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-yellow-300">Ad Spend & Budget</p>
                            <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-yellow-500">Total Spent</p>
                                <p className="text-lg font-bold text-yellow-400">{formatCurrency(offer.adSpend.spent)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-yellow-500">Total Budget</p>
                                <p className="text-lg font-bold text-yellow-400">{formatCurrency(offer.adSpend.totalBudget)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-yellow-500">Daily Budget</p>
                                <p className="text-lg font-bold text-yellow-400">{formatCurrency(offer.adSpend.dailyBudget)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-yellow-500">CPM Rate</p>
                                <p className="text-lg font-bold text-yellow-400">{formatCurrency(offer.adSpend.cpm)}</p>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-yellow-500">Budget Usage</span>
                                <span className="text-xs text-yellow-400 font-medium">
                                  {((offer.adSpend.spent / offer.adSpend.totalBudget) * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-yellow-800/50 rounded-full h-2">
                                <div 
                                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min((offer.adSpend.spent / offer.adSpend.totalBudget) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <ChartBarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-300">Performance Metrics</p>
                            <div className="mt-3 grid grid-cols-2 lg:grid-cols-5 gap-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-100">
                                  <EyeIcon className="h-4 w-4 text-blue-400" />
                                  <span>{formatNumber(offer.performance.impressions)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Impressions</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-100">
                                  <CursorArrowRaysIcon className="h-4 w-4 text-green-400" />
                                  <span>{formatNumber(offer.performance.clicks)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Clicks</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center space-x-1 text-lg font-bold text-gray-100">
                                  <CheckCircleIcon className="h-4 w-4 text-purple-400" />
                                  <span>{formatNumber(offer.performance.redemptions)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Redemptions</p>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-100">{offer.performance.clickThroughRate.toFixed(1)}%</div>
                                <p className="text-xs text-gray-400 mt-1">CTR</p>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-100">{offer.performance.redemptionRate.toFixed(1)}%</div>
                                <p className="text-xs text-gray-400 mt-1">Redemption Rate</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Target Audience */}
                      <div className="bg-indigo-900/20 border border-indigo-700/50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <EyeIcon className="h-5 w-5 text-indigo-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-indigo-300">Target Audience</p>
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center rounded-md bg-indigo-800/50 px-2 py-1 text-xs font-medium text-indigo-300">
                                Age: {offer.targetAudience.ageRange}
                              </span>
                              {offer.targetAudience.interests.map((interest: any, index: number) => (
                                <span key={index} className="inline-flex items-center rounded-md bg-indigo-800/50 px-2 py-1 text-xs font-medium text-indigo-300">
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timestamps */}
                      <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-700">
                        <span>Created: {offer.createdAt.toLocaleDateString()}</span>
                        <span>Last Modified: {offer.lastModified.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredOffers.length === 0 && (
              <div className="text-center py-12">
                <TagIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No promotional offers found</h3>
                <p className="mt-1 text-sm text-gray-400">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Brand partners haven\'t created any promotional offers yet.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedOffer && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}></div>
              <div className="relative w-full max-w-4xl mx-auto">
                <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-100">Campaign Details</h3>
                      <button
                        onClick={() => setShowDetailModal(false)}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-6">
                    {/* Campaign Header */}
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-900/50 rounded-lg">
                        <BuildingStorefrontIcon className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-100">{selectedOffer.campaignName}</h4>
                        <p className="text-gray-400">{selectedOffer.brandName}</p>
                        <div className="mt-2">
                          {getStatusConfig(selectedOffer.status).badge}
                        </div>
                      </div>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Offer Details */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Offer Details</h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
                          <p className="text-gray-100">{selectedOffer.offerDetails}</p>
                          <div className="flex items-center space-x-2">
                            <TagIcon className="h-4 w-4 text-gray-400" />
                            <code className="text-sm bg-gray-600 px-2 py-1 rounded text-gray-300">
                              {selectedOffer.couponCode}
                            </code>
                          </div>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Performance</h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Impressions:</span>
                            <span className="text-gray-100">{formatNumber(selectedOffer.performance.impressions)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Clicks:</span>
                            <span className="text-gray-100">{formatNumber(selectedOffer.performance.clicks)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">CTR:</span>
                            <span className="text-gray-100">{selectedOffer.performance.clickThroughRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Redemptions:</span>
                            <span className="text-gray-100">{formatNumber(selectedOffer.performance.redemptions)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location & Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Location</h5>
                        <div className="bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <MapPinIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-100">{selectedOffer.location.city}, {selectedOffer.location.state}</span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {formatRadius(selectedOffer.location.radius)} radius
                          </p>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-300 mb-2">Budget</h5>
                        <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total Budget:</span>
                            <span className="text-gray-100">{formatCurrency(selectedOffer.adSpend.totalBudget)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Spent:</span>
                            <span className="text-gray-100">{formatCurrency(selectedOffer.adSpend.spent)}</span>
                          </div>
                          <div className="w-full bg-gray-600 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${(selectedOffer.adSpend.spent / selectedOffer.adSpend.totalBudget) * 100}%` }}
                            ></div>
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
                    <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                      Edit Campaign
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