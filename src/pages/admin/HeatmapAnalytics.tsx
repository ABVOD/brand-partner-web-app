import React, { useState, useEffect } from 'react';
import { useUsageTracking } from '../../hooks/useUsageTracking';
import UsageLogsViewer from '../../components/UsageLogsViewer';
import HeatmapVisualization from '../../components/HeatmapVisualization';
import { usageTracker } from '../../utils/usageTracker';
import type { ClickHeatmapData, PageHeatmapData, UsageLog } from '../../types/analytics';
import AdminDashboardLayout from '../../components/AdminDashboardLayout';

export default function HeatmapAnalytics() {
  const { trackFeatureUsage } = useUsageTracking();
  const [selectedView, setSelectedView] = useState<'overview' | 'heatmaps' | 'logs' | 'settings'>('overview');
  const [clickData, setClickData] = useState<ClickHeatmapData[]>([]);
  const [pageData, setPageData] = useState<PageHeatmapData[]>([]);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(true);

  useEffect(() => {
    trackFeatureUsage('heatmap_analytics_page');
    loadHeatmapData();
  }, [trackFeatureUsage]);

  const loadHeatmapData = () => {
    const logs = usageTracker.getStoredLogs();
    const clicks = usageTracker.getClickHeatmapData();
    
    // Group clicks by page
    const pageMap = new Map<string, ClickHeatmapData[]>();
    clicks.forEach(click => {
      if (!pageMap.has(click.page)) {
        pageMap.set(click.page, []);
      }
      pageMap.get(click.page)!.push(click);
    });

    // Calculate page statistics
    const pageStats: PageHeatmapData[] = [];
    pageMap.forEach((clicks, page) => {
      const pageViews = logs.filter(log => log.page === page && log.action === 'page_view');
      const uniqueUsers = new Set(pageViews.map(log => log.userId)).size;
      const totalTime = pageViews.reduce((sum, log) => sum + (log.duration || 0), 0);
      const averageTime = pageViews.length > 0 ? totalTime / pageViews.length / 1000 : 0;

      pageStats.push({
        page,
        totalClicks: clicks.reduce((sum, click) => sum + click.clicks, 0),
        uniqueUsers,
        averageTimeSpent: Math.round(averageTime),
        clicks
      });
    });

    setClickData(clicks);
    setPageData(pageStats);
  };

  const handleTrackingToggle = () => {
    const newEnabled = !isTrackingEnabled;
    setIsTrackingEnabled(newEnabled);
    
    // Update tracking configuration
    usageTracker['config'] = {
      ...usageTracker['config'],
      enabled: newEnabled
    };

    trackFeatureUsage('tracking_toggle', { enabled: newEnabled });
  };

  const generateMockData = () => {
    const pages = ['/dashboard', '/campaigns', '/analytics', '/settings'];
    const actions = ['click', 'page_view', 'scroll', 'hover'];
    
    for (let i = 0; i < 100; i++) {
      const mockLog: Partial<UsageLog> = {
        userId: `user_${Math.floor(Math.random() * 10)}`,
        sessionId: `session_${Math.floor(Math.random() * 20)}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        action: actions[Math.floor(Math.random() * actions.length)] as any,
        page: pages[Math.floor(Math.random() * pages.length)],
        element: Math.random() > 0.5 ? `button-${Math.floor(Math.random() * 10)}` : undefined,
        coordinates: Math.random() > 0.3 ? {
          x: Math.floor(Math.random() * 1200),
          y: Math.floor(Math.random() * 800)
        } : undefined,
        duration: Math.random() > 0.5 ? Math.floor(Math.random() * 30000) : undefined,
        userAgent: navigator.userAgent
      };

      // Manually add to storage for demo
      const existingLogs = JSON.parse(localStorage.getItem('usageLogs') || '[]');
      existingLogs.push({
        id: `mock_${Date.now()}_${i}`,
        ...mockLog
      });
      localStorage.setItem('usageLogs', JSON.stringify(existingLogs));
    }

    loadHeatmapData();
    trackFeatureUsage('generate_mock_data');
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all tracking data? This action cannot be undone.')) {
      usageTracker.clearLogs();
      setClickData([]);
      setPageData([]);
      trackFeatureUsage('clear_all_data');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-blue-400">
                {clickData.reduce((sum, click) => sum + click.clicks, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Clicks</div>
            </div>
            <div className="w-12 h-12 bg-blue-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-green-400">{pageData.length}</div>
              <div className="text-sm text-gray-400">Pages Tracked</div>
            </div>
            <div className="w-12 h-12 bg-green-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-purple-400">
                {clickData.filter(click => click.clicks > 5).length}
              </div>
              <div className="text-sm text-gray-400">Hot Spots</div>
            </div>
            <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-orange-400">
                {pageData.reduce((sum, page) => sum + page.uniqueUsers, 0)}
              </div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="w-12 h-12 bg-orange-900/50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => loadHeatmapData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
          <button
            onClick={generateMockData}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Sample Data
          </button>
          <button
            onClick={clearAllData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear All Data
          </button>
          <button
            onClick={() => {
              const data = usageTracker.exportLogs();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `usage-logs-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Page Statistics */}
      {pageData.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-gray-100">Page Statistics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Page
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total Clicks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Unique Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Avg Time (s)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {pageData.map((page, index) => (
                  <tr key={index} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      {page.page}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {page.totalClicks}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {page.uniqueUsers}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {page.averageTimeSpent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Tracking Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-100">Enable Usage Tracking</label>
              <p className="text-sm text-gray-400">Track user interactions and page views</p>
            </div>
            <button
              onClick={handleTrackingToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isTrackingEnabled ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-gray-100 transition-transform ${
                  isTrackingEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-100">Storage Usage</label>
              <p className="text-sm text-gray-400">Current usage tracking data size</p>
            </div>
            <span className="text-sm text-gray-300">
              {Math.round(JSON.stringify(usageTracker.getStoredLogs()).length / 1024)} KB
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-100">Heatmap Analytics</h1>
            <p className="text-gray-400 mt-1">User interaction tracking and behavior analysis</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'heatmaps', label: 'Heatmaps' },
              { id: 'logs', label: 'Usage Logs' },
              { id: 'settings', label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedView === tab.id
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {selectedView === 'overview' && renderOverview()}
                 {selectedView === 'heatmaps' && (
           <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
             <HeatmapVisualization type="clicks" data={clickData} />
           </div>
         )}
        {selectedView === 'logs' && (
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <UsageLogsViewer />
          </div>
        )}
        {selectedView === 'settings' && renderSettings()}
      </div>
    </AdminDashboardLayout>
  );
} 