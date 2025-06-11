export interface ClickHeatmapData {
  x: number;
  y: number;
  clicks: number;
  timestamp: Date;
  userId?: string;
  page: string;
  element?: string;
}

export interface PageHeatmapData {
  page: string;
  totalClicks: number;
  uniqueUsers: number;
  averageTimeSpent: number;
  clicks: ClickHeatmapData[];
}

export interface UsageLog {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  action: 'page_view' | 'click' | 'scroll' | 'hover' | 'form_submit' | 'search' | 'download';
  page: string;
  element?: string;
  metadata?: Record<string, any>;
  coordinates?: { x: number; y: number };
  duration?: number;
  userAgent: string;
  ip?: string;
}

export interface HeatmapConfig {
  enabled: boolean;
  trackClicks: boolean;
  trackScrolls: boolean;
  trackHovers: boolean;
  excludeElements: string[];
  sampleRate: number;
}

export interface UsageAnalytics {
  totalPageViews: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ page: string; views: number; averageTime: number }>;
  clickHeatmap: PageHeatmapData[];
  scrollDepth: Array<{ page: string; averageDepth: number; maxDepth: number }>;
  userFlow: Array<{ from: string; to: string; count: number }>;
}

export interface HeatmapVisualizationData {
  date: string;
  value: number;
  count: number;
} 