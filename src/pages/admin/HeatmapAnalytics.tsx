import React, { useState, useEffect } from 'react';
import { useUsageTracking } from '../../hooks/useUsageTracking';
import UsageLogsViewer from '../../components/UsageLogsViewer';
import HeatmapVisualization from '../../components/HeatmapVisualization';
import { usageTracker } from '../../utils/usageTracker';
import type { ClickHeatmapData, PageHeatmapData, UsageLog } from '../../types/analytics';

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
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-blue-600">
                {clickData.reduce((sum, click) => sum + click.clicks, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Clicks</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-green-600">{pageData.length}</div>
              <div className="text-sm text-gray-600">Pages Tracked</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-purple-600">
                {clickData.filter(click => click.clicks > 5).length}
              </div>
              <div className="text-sm text-gray-600">Hot Spots</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-orange-600">
                {pageData.reduce((sum, page) => sum + page.uniqueUsers, 0)}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
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
              const link = document.createElement('a');
              link.href = url;
              link.download = `heatmap-data-${new Date().toISOString().split('T')[0]}.json`;
              link.click();
              URL.revokeObjectURL(url);
              trackFeatureUsage('export_data');
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Export Data
          </button>
        </div>
      </div>

      {/* Page Performance Table */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Page Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Users</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time (s)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hot Spots</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pageData.slice(0, 10).map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{page.page}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.totalClicks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.uniqueUsers}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{page.averageTimeSpent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {page.clicks.filter(click => click.clicks > 5).length}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Tracking Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-900">Enable Usage Tracking</label>
              <p className="text-sm text-gray-500">Collect user interaction data for analytics</p>
            </div>
            <button
              onClick={handleTrackingToggle}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isTrackingEnabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isTrackingEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Tracking Status</h4>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between py-1">
                  <span>Click Tracking:</span>
                  <span className="text-green-600">Enabled</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Scroll Tracking:</span>
                  <span className="text-green-600">Enabled</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Hover Tracking:</span>
                  <span className="text-red-600">Disabled</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Sample Rate:</span>
                  <span className="text-blue-600">100%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Data Storage</h4>
              <div className="text-sm text-gray-600">
                <div className="flex justify-between py-1">
                  <span>Stored Events:</span>
                  <span>{usageTracker.getStoredLogs().length}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Storage Location:</span>
                  <span>Local Storage</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Auto Cleanup:</span>
                  <span className="text-green-600">Yes (1000 events)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Heatmap Analytics</h1>
        <p className="text-gray-600">
          Monitor user interactions and behavior patterns with comprehensive heatmap visualization
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'heatmaps', label: 'Heatmaps', icon: '🔥' },
              { key: 'logs', label: 'Usage Logs', icon: '📋' },
              { key: 'settings', label: 'Settings', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setSelectedView(tab.key as any);
                  trackFeatureUsage('tab_switch', { tab: tab.key });
                }}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedView === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {selectedView === 'overview' && renderOverview()}
        {selectedView === 'heatmaps' && (
          <div className="space-y-6">
            <HeatmapVisualization type="clicks" data={clickData} />
            <HeatmapVisualization type="usage" pageData={pageData} />
            <HeatmapVisualization type="calendar" />
          </div>
        )}
        {selectedView === 'logs' && <UsageLogsViewer />}
        {selectedView === 'settings' && renderSettings()}
      </div>
    </div>
  );
} 