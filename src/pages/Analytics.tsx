import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data - in a real app, this would come from your backend
const impressionData = [
  { date: '2024-01', impressions: 4000, clicks: 2400, conversions: 400, redemptions: 240 },
  { date: '2024-02', impressions: 3000, clicks: 1398, conversions: 300, redemptions: 210 },
  { date: '2024-03', impressions: 2000, clicks: 9800, conversions: 200, redemptions: 290 },
  { date: '2024-04', impressions: 2780, clicks: 3908, conversions: 280, redemptions: 200 },
  { date: '2024-05', impressions: 1890, clicks: 4800, conversions: 190, redemptions: 180 },
  { date: '2024-06', impressions: 2390, clicks: 3800, conversions: 240, redemptions: 220 },
  { date: '2024-07', impressions: 3490, clicks: 4300, conversions: 350, redemptions: 250 },
];

const offerPerformance = [
  { name: 'Summer Sale', impressions: 4000, clicks: 2400, conversions: 400 },
  { name: 'Weekend Deal', impressions: 3000, clicks: 1398, conversions: 300 },
  { name: 'Holiday Special', impressions: 2000, clicks: 9800, conversions: 200 },
  { name: 'Flash Sale', impressions: 2780, clicks: 3908, conversions: 280 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7d');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Analytics
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Track your campaign performance and engagement metrics
            </p>
          </div>
          <div className="mt-4 sm:ml-4 sm:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { name: 'Total Impressions', value: '102.4k', change: '+12.3%' },
            { name: 'Total Clicks', value: '24.5k', change: '+8.1%' },
            { name: 'Conversion Rate', value: '3.2%', change: '+2.5%' },
            { name: 'Redemption Rate', value: '1.8%', change: '+0.8%' },
          ].map((stat) => (
            <div key={stat.name} className="rounded-lg bg-white shadow">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="w-full">
                    <p className="text-sm font-medium leading-6 text-gray-600">{stat.name}</p>
                    <p className="mt-2 flex items-baseline gap-x-2">
                      <span className="text-4xl font-semibold tracking-tight text-gray-900">
                        {stat.value}
                      </span>
                      <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Performance Over Time
              </h3>
              <div className="mt-6" style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={impressionData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="impressions" stackId="1" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="clicks" stackId="2" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="conversions" stackId="3" stroke="#2563EB" fill="#2563EB" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white shadow">
            <div className="p-6">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Offer Performance Comparison
              </h3>
              <div className="mt-6" style={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={offerPerformance}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="impressions" fill="#4F46E5" />
                    <Bar dataKey="clicks" fill="#7C3AED" />
                    <Bar dataKey="conversions" fill="#2563EB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 