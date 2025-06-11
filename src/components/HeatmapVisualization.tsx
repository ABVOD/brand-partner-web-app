import React, { useState, useEffect, useRef } from 'react';
import type { ClickHeatmapData, PageHeatmapData, HeatmapVisualizationData } from '../types/analytics';
import { usageTracker } from '../utils/usageTracker';

interface HeatmapVisualizationProps {
  data?: ClickHeatmapData[];
  pageData?: PageHeatmapData[];
  type: 'clicks' | 'calendar' | 'usage';
  className?: string;
}

export default function HeatmapVisualization({ 
  data, 
  pageData, 
  type, 
  className = '' 
}: HeatmapVisualizationProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedPage, setSelectedPage] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [calendarData, setCalendarData] = useState<HeatmapVisualizationData[]>([]);

  useEffect(() => {
    if (type === 'calendar') {
      generateCalendarData();
    }
  }, [type]);

  const generateCalendarData = () => {
    const logs = usageTracker.getStoredLogs();
    const dataMap = new Map<string, number>();

    logs.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      dataMap.set(date, (dataMap.get(date) || 0) + 1);
    });

    const calendarEntries: HeatmapVisualizationData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30); // Last 30 days

    for (let d = new Date(startDate); d <= new Date(); d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      calendarEntries.push({
        date: dateStr,
        value: dataMap.get(dateStr) || 0,
        count: dataMap.get(dateStr) || 0
      });
    }

    setCalendarData(calendarEntries);
  };

  const renderClickHeatmap = () => {
    if (!data || data.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No click data available. Start using the application to generate heatmap data.
        </div>
      );
    }

    const maxClicks = Math.max(...data.map(d => d.clicks));

    return (
      <div className="relative">
        <div className="absolute inset-0 overflow-hidden">
          {data.map((click, index) => (
            <div
              key={index}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: click.x - 10,
                top: click.y - 10,
                width: Math.max(20, (click.clicks / maxClicks) * 40),
                height: Math.max(20, (click.clicks / maxClicks) * 40),
                backgroundColor: `rgba(239, 68, 68, ${0.3 + (click.clicks / maxClicks) * 0.7})`,
                border: '1px solid rgba(239, 68, 68, 0.5)'
              }}
              title={`${click.clicks} clicks at (${click.x}, ${click.y})`}
            />
          ))}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Click Heatmap</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Clicks:</span>
              <span className="ml-2">{data.reduce((sum, d) => sum + d.clicks, 0)}</span>
            </div>
            <div>
              <span className="font-medium">Hotspots:</span>
              <span className="ml-2">{data.filter(d => d.clicks > 5).length}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCalendarHeatmap = () => {
    const maxActivity = Math.max(...calendarData.map(d => d.count), 1);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Usage Activity Calendar (Last 30 Days)</h3>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs text-gray-500 text-center py-1 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, index) => {
            const intensity = day.count / maxActivity;
            const date = new Date(day.date);
            const dayOfWeek = date.getDay();
            
            return (
              <div
                key={day.date}
                className="aspect-square rounded-sm border border-gray-200 flex items-center justify-center text-xs relative group cursor-pointer"
                style={{
                  backgroundColor: day.count === 0 
                    ? '#f3f4f6' 
                    : `rgba(34, 197, 94, ${0.2 + intensity * 0.8})`,
                  gridColumnStart: index === 0 ? dayOfWeek + 1 : undefined
                }}
                title={`${day.date}: ${day.count} activities`}
              >
                <span className="text-gray-700 font-medium">
                  {date.getDate()}
                </span>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full z-10 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {day.date}: {day.count} activities
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-sm bg-gray-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-200"></div>
            <div className="w-3 h-3 rounded-sm bg-green-400"></div>
            <div className="w-3 h-3 rounded-sm bg-green-600"></div>
            <div className="w-3 h-3 rounded-sm bg-green-800"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    );
  };

  const renderUsageHeatmap = () => {
    if (!pageData || pageData.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          No page usage data available.
        </div>
      );
    }

    const maxClicks = Math.max(...pageData.map(p => p.totalClicks));

    return (
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Page Usage Heatmap</h3>
          
          <div className="space-y-3">
            {pageData.map((page, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{page.page}</div>
                    <div className="text-sm text-gray-500">
                      {page.totalClicks} clicks • {page.uniqueUsers} users • {Math.round(page.averageTimeSpent)}s avg
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div 
                      className="h-6 rounded"
                      style={{
                        width: `${Math.max(20, (page.totalClicks / maxClicks) * 200)}px`,
                        backgroundColor: `rgba(59, 130, 246, ${0.2 + (page.totalClicks / maxClicks) * 0.8})`
                      }}
                    />
                    <button
                      onClick={() => setSelectedPage(selectedPage === page.page ? '' : page.page)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {selectedPage === page.page ? 'Hide' : 'View'} Details
                    </button>
                  </div>
                </div>
                
                {selectedPage === page.page && (
                  <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Click Distribution</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      {page.clicks.slice(0, 8).map((click, clickIndex) => (
                        <div key={clickIndex} className="bg-white p-2 rounded border">
                          <div className="font-medium">{click.element || 'Unknown'}</div>
                          <div className="text-gray-500">{click.clicks} clicks</div>
                          <div className="text-xs text-gray-400">
                            ({click.x}, {click.y})
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'clicks':
        return renderClickHeatmap();
      case 'calendar':
        return renderCalendarHeatmap();
      case 'usage':
        return renderUsageHeatmap();
      default:
        return <div>Unknown heatmap type</div>;
    }
  };

  return (
    <div className={`heatmap-visualization ${className}`} ref={containerRef}>
      {renderContent()}
    </div>
  );
} 