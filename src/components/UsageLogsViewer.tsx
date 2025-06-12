import { useState, useEffect, useMemo } from 'react';
import { usageTracker } from '../utils/usageTracker';
import type { UsageLog, ClickHeatmapData, UsageAnalytics, PageHeatmapData } from '../types/analytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface UsageLogsViewerProps {
  className?: string;
}

export default function UsageLogsViewer({ className = '' }: UsageLogsViewerProps) {
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<UsageLog[]>([]);
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('7d');
  const [currentView, setCurrentView] = useState<'overview' | 'logs' | 'heatmap' | 'analytics'>('overview');

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, selectedAction, selectedPage, dateFilter]);

  const loadLogs = () => {
    const storedLogs = usageTracker.getStoredLogs();
    setLogs(storedLogs);
  };

  const filterLogs = () => {
    let filtered = [...logs];

    // Filter by date
    const now = new Date();
    const filterDate = new Date();
    switch (dateFilter) {
      case '1d':
        filterDate.setDate(now.getDate() - 1);
        break;
      case '7d':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        filterDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        filterDate.setDate(now.getDate() - 90);
        break;
    }

    filtered = filtered.filter(log => new Date(log.timestamp) >= filterDate);

    // Filter by action
    if (selectedAction !== 'all') {
      filtered = filtered.filter(log => log.action === selectedAction);
    }

    // Filter by page
    if (selectedPage !== 'all') {
      filtered = filtered.filter(log => log.page === selectedPage);
    }

    setFilteredLogs(filtered);
  };

  const analytics = useMemo((): UsageAnalytics => {
    const pageViews = filteredLogs.filter(log => log.action === 'page_view');
    const clicks = filteredLogs.filter(log => log.action === 'click');
    const uniqueUsers = new Set(filteredLogs.map(log => log.userId)).size;

    // Calculate page statistics
    const pageViewStats = new Map<string, { views: number; totalTime: number; users: Set<string> }>();
    pageViews.forEach(log => {
      if (!pageViewStats.has(log.page)) {
        pageViewStats.set(log.page, { views: 0, totalTime: 0, users: new Set() });
      }
      const stats = pageViewStats.get(log.page)!;
      stats.views++;
      stats.users.add(log.userId);
      if (log.duration) {
        stats.totalTime += log.duration;
      }
    });

    const topPages = Array.from(pageViewStats.entries()).map(([page, stats]) => ({
      page,
      views: stats.views,
      averageTime: stats.views > 0 ? Math.round(stats.totalTime / stats.views / 1000) : 0
    })).sort((a, b) => b.views - a.views).slice(0, 10);

    // Calculate click heatmap data
    const clickHeatmapData: ClickHeatmapData[] = [];
    const clickMap = new Map<string, ClickHeatmapData>();

    clicks.forEach(log => {
      if (log.coordinates) {
        const key = `${log.page}-${Math.round(log.coordinates.x / 20) * 20}-${Math.round(log.coordinates.y / 20) * 20}`;
        if (clickMap.has(key)) {
          clickMap.get(key)!.clicks++;
        } else {
          clickMap.set(key, {
            x: log.coordinates.x,
            y: log.coordinates.y,
            clicks: 1,
            timestamp: new Date(log.timestamp),
            userId: log.userId,
            page: log.page,
            element: log.element
          });
        }
      }
    });

    // Calculate session duration
    const sessionDurations = new Map<string, number>();
    filteredLogs.forEach(log => {
      if (!sessionDurations.has(log.sessionId)) {
        sessionDurations.set(log.sessionId, 0);
      }
      if (log.duration) {
        sessionDurations.set(log.sessionId, sessionDurations.get(log.sessionId)! + log.duration);
      }
    });

    const averageSessionDuration = sessionDurations.size > 0 ?
      Array.from(sessionDurations.values()).reduce((a, b) => a + b, 0) / sessionDurations.size / 1000 : 0;

    // Group click data by page for PageHeatmapData format
    const pageHeatmapData: PageHeatmapData[] = [];
    const pageClickMap = new Map<string, ClickHeatmapData[]>();

    Array.from(clickMap.values()).forEach(click => {
      if (!pageClickMap.has(click.page)) {
        pageClickMap.set(click.page, []);
      }
      pageClickMap.get(click.page)!.push(click);
    });

    pageClickMap.forEach((clicks, page) => {
      const pageStats = pageViewStats.get(page);
      pageHeatmapData.push({
        page,
        totalClicks: clicks.reduce((sum, click) => sum + click.clicks, 0),
        uniqueUsers: pageStats ? pageStats.users.size : 0,
        averageTimeSpent: pageStats && pageStats.views > 0 ? Math.round(pageStats.totalTime / pageStats.views / 1000) : 0,
        clicks
      });
    });

    return {
      totalPageViews: pageViews.length,
      uniqueVisitors: uniqueUsers,
      averageSessionDuration: Math.round(averageSessionDuration),
      bounceRate: 0, // Would need more complex calculation
      topPages,
      clickHeatmap: pageHeatmapData,
      scrollDepth: [], // Would need scroll tracking implementation
      userFlow: [] // Would need flow analysis
    };
  }, [filteredLogs]);

  const actionCounts = useMemo(() => {
    const counts = new Map<string, number>();
    filteredLogs.forEach(log => {
      counts.set(log.action, (counts.get(log.action) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([action, count]) => ({ action, count }));
  }, [filteredLogs]);

  const hourlyActivity = useMemo(() => {
    const hourCounts = new Array(24).fill(0);
    filteredLogs.forEach(log => {
      const hour = new Date(log.timestamp).getHours();
      hourCounts[hour]++;
    });
    return hourCounts.map((count, hour) => ({ hour: hour.toString().padStart(2, '0') + ':00', count }));
  }, [filteredLogs]);

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `usage-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all usage logs? This action cannot be undone.')) {
      usageTracker.clearLogs();
      setLogs([]);
      setFilteredLogs([]);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
          <div className="text-2xl font-bold text-blue-400">{analytics.totalPageViews}</div>
          <div className="text-sm text-gray-400">Page Views</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
          <div className="text-2xl font-bold text-green-400">{analytics.uniqueVisitors}</div>
          <div className="text-sm text-gray-400">Unique Users</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
          <div className="text-2xl font-bold text-purple-400">{analytics.averageSessionDuration}s</div>
          <div className="text-sm text-gray-400">Avg Session</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
          <div className="text-2xl font-bold text-orange-400">{filteredLogs.length}</div>
          <div className="text-sm text-gray-400">Total Events</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Distribution */}
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Action Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={actionCounts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="action" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#60A5FA" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Activity */}
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Hourly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={hourlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="hour" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="count" stroke="#34D399" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4">Top Pages</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Page</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Views</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-300">Avg Time (s)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {analytics.topPages.map((page, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm font-medium text-gray-100">{page.page}</td>
                  <td className="px-4 py-2 text-sm text-gray-300">{page.views}</td>
                  <td className="px-4 py-2 text-sm text-gray-300">{page.averageTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Recent Activity Logs</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Timestamp</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">User</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Action</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Page</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Element</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.slice(0, 100).map((log, index) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-600">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{log.userId}</td>
                <td className="px-4 py-2">
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full ${log.action === 'click' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'page_view' ? 'bg-green-100 text-green-800' :
                        log.action === 'scroll' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                    }`}>
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">{log.page}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{log.element || '-'}</td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {log.coordinates && `(${log.coordinates.x}, ${log.coordinates.y})`}
                  {log.duration && ` ${Math.round(log.duration / 1000)}s`}
                  {log.metadata && Object.keys(log.metadata).length > 0 && ' +meta'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderHeatmap = () => (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="text-lg font-semibold mb-4">Click Heatmap</h3>
      {analytics.clickHeatmap.length > 0 ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.clickHeatmap.reduce((sum, pageData) => sum + pageData.totalClicks, 0)}
              </div>
              <div className="text-gray-600">Total Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {analytics.clickHeatmap.reduce((sum, pageData) => sum + pageData.clicks.length, 0)}
              </div>
              <div className="text-gray-600">Click Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.clickHeatmap.reduce((sum, pageData) =>
                  sum + pageData.clicks.filter(click => click.clicks > 5).length, 0)}
              </div>
              <div className="text-gray-600">Hot Spots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {analytics.clickHeatmap.length}
              </div>
              <div className="text-gray-600">Pages</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Top Click Areas</h4>
            {analytics.clickHeatmap
              .flatMap(pageData => pageData.clicks)
              .sort((a, b) => b.clicks - a.clicks)
              .slice(0, 10)
              .map((click, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">{click.element || 'Unknown Element'}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      on {click.page} at ({click.x}, {click.y})
                    </span>
                  </div>
                  <span className="font-semibold text-blue-600">{click.clicks} clicks</span>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No click data available. Click tracking will appear here as users interact with the application.
        </div>
      )}
    </div>
  );

  const uniqueActions = useMemo(() => Array.from(new Set(logs.map(log => log.action))), [logs]);
  const uniquePages = useMemo(() => Array.from(new Set(logs.map(log => log.page))), [logs]);

  return (
    <div className={`usage-logs-viewer ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow border mb-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Usage Analytics & Logs</h2>
            <div className="flex space-x-2">
              <button
                onClick={exportLogs}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export Logs
              </button>
              <button
                onClick={clearLogs}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Actions</option>
                {uniqueActions.map(action => (
                  <option key={action} value={action}>{action}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Page</label>
              <select
                value={selectedPage}
                onChange={(e) => setSelectedPage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Pages</option>
                {uniquePages.map(page => (
                  <option key={page} value={page}>{page}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={loadLogs}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="p-4">
          <div className="flex space-x-4 border-b">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'logs', label: 'Raw Logs' },
              { key: 'heatmap', label: 'Heatmap' },
              { key: 'analytics', label: 'Analytics' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setCurrentView(tab.key as any)}
                className={`px-4 py-2 font-medium ${currentView === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {currentView === 'overview' && renderOverview()}
        {currentView === 'logs' && renderLogs()}
        {currentView === 'heatmap' && renderHeatmap()}
        {currentView === 'analytics' && renderOverview()}
      </div>
    </div>
  );
} 