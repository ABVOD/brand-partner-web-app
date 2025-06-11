import DashboardLayout from '../components/DashboardLayout';
import { useUsageTracking } from '../hooks/useUsageTracking';
import { 
  MapPinIcon, 
  CreditCardIcon, 
  ChatBubbleLeftRightIcon, 
  EyeIcon,
  CursorArrowRaysIcon,
  BanknotesIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const stats = [
  { 
    name: 'Active Campaigns', 
    value: '8', 
    change: '+12%', 
    changeType: 'increase',
    href: '/location-campaigns', 
    icon: MapPinIcon,
    description: 'Currently running'
  },
  { 
    name: 'Total Impressions', 
    value: '127.5K', 
    change: '+23%', 
    changeType: 'increase',
    href: '/location-campaigns', 
    icon: EyeIcon,
    description: 'This month'
  },
  { 
    name: 'Click-through Rate', 
    value: '4.2%', 
    change: '+0.8%', 
    changeType: 'increase',
    href: '/location-campaigns', 
    icon: CursorArrowRaysIcon,
    description: 'Average CTR'
  },
  { 
    name: 'Monthly Spend', 
    value: '$2,847', 
    change: '-5%', 
    changeType: 'decrease',
    href: '/billing', 
    icon: BanknotesIcon,
    description: 'Current month'
  },
];

const recentCampaigns = [
  {
    id: 1,
    name: 'Summer Sale Downtown',
    location: 'New York, NY',
    status: 'Active',
    impressions: '45.2K',
    ctr: '5.1%',
    spend: '$456',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 2,
    name: 'Weekend Brunch Special',
    location: 'Los Angeles, CA',
    status: 'Active',
    impressions: '32.8K',
    ctr: '3.9%',
    spend: '$342',
    statusColor: 'bg-green-100 text-green-800'
  },
  {
    id: 3,
    name: 'Holiday Flash Sale',
    location: 'Chicago, IL',
    status: 'Paused',
    impressions: '28.1K',
    ctr: '4.7%',
    spend: '$298',
    statusColor: 'bg-yellow-100 text-yellow-800'
  },
  {
    id: 4,
    name: 'Happy Hour Deal',
    location: 'Miami, FL',
    status: 'Completed',
    impressions: '21.4K',
    ctr: '6.2%',
    spend: '$234',
    statusColor: 'bg-gray-100 text-gray-800'
  }
];

const performanceData = [
  { period: 'Week 1', impressions: 28000, clicks: 1120, conversions: 45 },
  { period: 'Week 2', impressions: 32000, clicks: 1280, conversions: 52 },
  { period: 'Week 3', impressions: 35000, clicks: 1400, conversions: 68 },
  { period: 'Week 4', impressions: 32500, clicks: 1365, conversions: 61 },
];

export default function Dashboard() {
  const { trackEvent, trackFeatureUsage } = useUsageTracking();

  const handleStatClick = (statName: string, href: string) => {
    trackFeatureUsage('dashboard_stat_click', { 
      statName, 
      destination: href 
    });
  };

  const handleCampaignView = (campaignId: number, campaignName: string) => {
    trackEvent('campaign_view', { 
      campaignId, 
      campaignName,
      source: 'dashboard'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:text-4xl sm:tracking-tight">
            Dashboard
          </h2>
          <p className="mt-2 text-lg leading-6 text-gray-600">
            Monitor your location-based marketing performance
          </p>
        </div>

        {/* Key Metrics */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Performance Metrics</h3>
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleStatClick(item.name, item.href)}
                className="relative overflow-hidden rounded-xl bg-white px-6 py-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <dt>
                  <div className="absolute rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 p-3">
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                  <p className="ml-16 text-xs text-gray-400 mt-1">{item.description}</p>
                </dt>
                <dd className="ml-16 flex items-baseline justify-between pb-6 sm:pb-7">
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <div className={`inline-flex items-baseline px-2.5 py-0.5 rounded-full text-sm font-medium ${
                    item.changeType === 'increase' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.changeType === 'increase' ? (
                      <ArrowUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {item.change}
                  </div>
                </dd>
              </Link>
            ))}
          </dl>
        </div>

        {/* Performance Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
                <p className="text-sm text-gray-600">Weekly performance overview</p>
              </div>
              <div className="flex space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Impressions
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Clicks
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Conversions
                </span>
              </div>
            </div>
            
            {/* Simple bar chart representation */}
            <div className="space-y-4">
              {performanceData.map((week, index) => (
                <div key={week.period} className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium text-gray-600">{week.period}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center">
                      <div className="w-24 text-xs text-gray-500">Impressions</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${(week.impressions / 35000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-xs text-gray-600 text-right">{week.impressions.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-xs text-gray-500">Clicks</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${(week.clicks / 1400) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-xs text-gray-600 text-right">{week.clicks.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-24 text-xs text-gray-500">Conversions</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full" 
                          style={{ width: `${(week.conversions / 68) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-16 text-xs text-gray-600 text-right">{week.conversions}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Two column layout for campaigns and activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Campaigns */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
                <Link 
                  to="/location-campaigns"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentCampaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{campaign.name}</h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${campaign.statusColor}`}>
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{campaign.location}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                        <span>{campaign.impressions} impressions</span>
                        <span>{campaign.ctr} CTR</span>
                        <span>{campaign.spend} spent</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <MapPinIcon className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New campaign launched</p>
                      <p className="text-xs text-gray-500">Summer Sale Downtown - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <ChartBarIcon className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Performance milestone reached</p>
                      <p className="text-xs text-gray-500">100K impressions achieved - 5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Support ticket resolved</p>
                      <p className="text-xs text-gray-500">Campaign optimization inquiry - 1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    to="/location-campaigns"
                    className="flex w-full items-center justify-center rounded-lg bg-white px-4 py-3 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-gray-50 transition-colors duration-200"
                  >
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    Create New Campaign
                  </Link>
                  <Link
                    to="/billing"
                    className="flex w-full items-center justify-center rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors duration-200"
                  >
                    <CreditCardIcon className="w-5 h-5 mr-2" />
                    View Billing
                  </Link>
                  <Link
                    to="/support"
                    className="flex w-full items-center justify-center rounded-lg bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors duration-200"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Get Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 