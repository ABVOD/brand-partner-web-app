import { useEffect, useCallback } from 'react';
import { usageTracker } from '../utils/usageTracker';
import type { HeatmapConfig } from '../types/analytics';

interface UseUsageTrackingOptions extends Partial<HeatmapConfig> {
  autoTrack?: boolean;
}

export function useUsageTracking(options: UseUsageTrackingOptions = {}) {
  const {
    autoTrack = true,
    enabled = true,
    trackClicks = true,
    trackScrolls = true,
    trackHovers = false,
    excludeElements = ['script', 'style', 'meta', 'link'],
    sampleRate = 1.0
  } = options;

  useEffect(() => {
    if (autoTrack && enabled) {
      // Update tracker configuration
      usageTracker['config'] = {
        enabled,
        trackClicks,
        trackScrolls,
        trackHovers,
        excludeElements,
        sampleRate
      };
      
      // Track page view on mount
      usageTracker.trackPageView();
    }
  }, [autoTrack, enabled, trackClicks, trackScrolls, trackHovers, excludeElements, sampleRate]);

  const trackEvent = useCallback((action: string, metadata: Record<string, any> = {}) => {
    if (enabled) {
      usageTracker.trackCustomEvent(action, metadata);
    }
  }, [enabled]);

  const trackFormSubmit = useCallback((formName: string, formData: Record<string, any> = {}) => {
    trackEvent('form_submit', { formName, ...formData });
  }, [trackEvent]);

  const trackSearch = useCallback((query: string, results?: number) => {
    trackEvent('search', { query, results });
  }, [trackEvent]);

  const trackDownload = useCallback((fileName: string, fileType?: string) => {
    trackEvent('download', { fileName, fileType });
  }, [trackEvent]);

  const trackFeatureUsage = useCallback((feature: string, metadata: Record<string, any> = {}) => {
    trackEvent('feature_usage', { feature, ...metadata });
  }, [trackEvent]);

  const getAnalytics = useCallback(() => {
    return {
      logs: usageTracker.getLogs(),
      storedLogs: usageTracker.getStoredLogs(),
      clickData: usageTracker.getClickHeatmapData(),
      exportData: () => usageTracker.exportLogs(),
      clearData: () => usageTracker.clearLogs()
    };
  }, []);

  return {
    trackEvent,
    trackFormSubmit,
    trackSearch,
    trackDownload,
    trackFeatureUsage,
    getAnalytics
  };
} 