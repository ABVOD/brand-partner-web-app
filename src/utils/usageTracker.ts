import type { UsageLog, ClickHeatmapData, HeatmapConfig } from '../types/analytics';

class UsageTracker {
  private config: HeatmapConfig;
  private sessionId: string;
  private logs: UsageLog[] = [];
  private clickData: ClickHeatmapData[] = [];
  private currentPage: string = '';
  private pageStartTime: number = Date.now();

  constructor(config: Partial<HeatmapConfig> = {}) {
    this.config = {
      enabled: true,
      trackClicks: true,
      trackScrolls: true,
      trackHovers: false,
      excludeElements: ['script', 'style', 'meta', 'link'],
      sampleRate: 1.0,
      ...config
    };
    
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldTrack(): boolean {
    return this.config.enabled && Math.random() < this.config.sampleRate;
  }

  private initializeTracking() {
    if (!this.shouldTrack()) return;

    // Track page views
    this.trackPageView();

    // Track clicks
    if (this.config.trackClicks) {
      document.addEventListener('click', this.handleClick.bind(this));
    }

    // Track scrolling
    if (this.config.trackScrolls) {
      let scrollTimeout: NodeJS.Timeout;
      document.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          this.handleScroll();
        }, 100);
      });
    }

    // Track hovers
    if (this.config.trackHovers) {
      document.addEventListener('mouseover', this.handleHover.bind(this));
    }

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.trackPageExit();
    });

    // Track route changes for SPAs
    window.addEventListener('popstate', () => {
      this.trackPageView();
    });
  }

  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.shouldExcludeElement(target)) return;

    const x = event.clientX;
    const y = event.clientY;

    // Log the click
    const log: UsageLog = {
      id: this.generateLogId(),
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      timestamp: new Date(),
      action: 'click',
      page: this.getCurrentPage(),
      element: this.getElementSelector(target),
      coordinates: { x, y },
      userAgent: navigator.userAgent
    };

    this.addLog(log);

    // Add to click heatmap data
    const existingClick = this.clickData.find(
      click => Math.abs(click.x - x) < 20 && Math.abs(click.y - y) < 20 && click.page === this.getCurrentPage()
    );

    if (existingClick) {
      existingClick.clicks++;
    } else {
      this.clickData.push({
        x,
        y,
        clicks: 1,
        timestamp: new Date(),
        userId: this.getCurrentUserId(),
        page: this.getCurrentPage(),
        element: this.getElementSelector(target)
      });
    }
  }

  private handleScroll() {
    const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);

    const log: UsageLog = {
      id: this.generateLogId(),
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      timestamp: new Date(),
      action: 'scroll',
      page: this.getCurrentPage(),
      metadata: { scrollDepth, scrollY: window.scrollY },
      userAgent: navigator.userAgent
    };

    this.addLog(log);
  }

  private handleHover(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (this.shouldExcludeElement(target)) return;

    const log: UsageLog = {
      id: this.generateLogId(),
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      timestamp: new Date(),
      action: 'hover',
      page: this.getCurrentPage(),
      element: this.getElementSelector(target),
      coordinates: { x: event.clientX, y: event.clientY },
      userAgent: navigator.userAgent
    };

    this.addLog(log);
  }

  private shouldExcludeElement(element: HTMLElement): boolean {
    const tagName = element.tagName.toLowerCase();
    return this.config.excludeElements.includes(tagName);
  }

  private getElementSelector(element: HTMLElement): string {
    const selectors = [];
    
    if (element.id) {
      selectors.push(`#${element.id}`);
    }
    
    if (element.className) {
      const classes = element.className.split(' ').filter(Boolean);
      if (classes.length > 0) {
        selectors.push(`.${classes.join('.')}`);
      }
    }
    
    selectors.push(element.tagName.toLowerCase());
    
    return selectors.join('');
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getCurrentUserId(): string {
    // Try to get user ID from localStorage or other storage
    return localStorage.getItem('userId') || 'anonymous';
  }

  private getCurrentPage(): string {
    return window.location.pathname;
  }

  private addLog(log: UsageLog) {
    this.logs.push(log);
    this.sendLogToBatch(log);
  }

  private sendLogToBatch(log: UsageLog) {
    // Send to backend or store locally
    // For now, we'll store in localStorage and send in batches
    const storedLogs = JSON.parse(localStorage.getItem('usageLogs') || '[]');
    storedLogs.push(log);
    
    // Keep only last 1000 logs in localStorage
    if (storedLogs.length > 1000) {
      storedLogs.splice(0, storedLogs.length - 1000);
    }
    
    localStorage.setItem('usageLogs', JSON.stringify(storedLogs));
  }

  public trackPageView() {
    if (this.currentPage !== this.getCurrentPage()) {
      // Track exit from previous page
      if (this.currentPage) {
        this.trackPageExit();
      }

      // Track entry to new page
      this.currentPage = this.getCurrentPage();
      this.pageStartTime = Date.now();

      const log: UsageLog = {
        id: this.generateLogId(),
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
        timestamp: new Date(),
        action: 'page_view',
        page: this.currentPage,
        userAgent: navigator.userAgent
      };

      this.addLog(log);
    }
  }

  private trackPageExit() {
    if (this.currentPage) {
      const duration = Date.now() - this.pageStartTime;
      
      const log: UsageLog = {
        id: this.generateLogId(),
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
        timestamp: new Date(),
        action: 'page_view',
        page: this.currentPage,
        duration: duration,
        userAgent: navigator.userAgent,
        metadata: { type: 'exit' }
      };

      this.addLog(log);
    }
  }

  public trackCustomEvent(action: string, metadata: Record<string, any> = {}) {
    const log: UsageLog = {
      id: this.generateLogId(),
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      timestamp: new Date(),
      action: action as any,
      page: this.getCurrentPage(),
      metadata: metadata,
      userAgent: navigator.userAgent
    };

    this.addLog(log);
  }

  public getClickHeatmapData(): ClickHeatmapData[] {
    return this.clickData;
  }

  public getLogs(): UsageLog[] {
    return this.logs;
  }

  public getStoredLogs(): UsageLog[] {
    return JSON.parse(localStorage.getItem('usageLogs') || '[]');
  }

  public clearLogs() {
    this.logs = [];
    this.clickData = [];
    localStorage.removeItem('usageLogs');
  }

  public exportLogs(): string {
    const allLogs = this.getStoredLogs();
    return JSON.stringify(allLogs, null, 2);
  }
}

// Create singleton instance
export const usageTracker = new UsageTracker();

export default UsageTracker; 