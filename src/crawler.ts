import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { load } from 'cheerio';
import { URL } from 'url';
import { logger, componentLogger, performanceLogger } from '../lib/logger';
import { crawlerConfig } from '../lib/config';
import type { CrawlResult, PerformanceMetrics } from '../types';

export class WebCrawler {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private crawledUrls = new Set<string>();
  private maxPages: number;
  private delay: number;
  private timeout: number;

  constructor(options: {
    maxPages?: number;
    delay?: number;
    timeout?: number;
  } = {}) {
    this.maxPages = options.maxPages || crawlerConfig.maxPages;
    this.delay = options.delay || crawlerConfig.delay;
    this.timeout = options.timeout || crawlerConfig.timeout;
  }

  async init(): Promise<void> {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080',
        ],
      });

      this.context = await this.browser.newContext({
        viewport: crawlerConfig.viewport,
        userAgent: crawlerConfig.userAgent,
        ignoreHTTPSErrors: true,
      });

      // Set reasonable timeouts
      this.context.setDefaultTimeout(this.timeout);
      this.context.setDefaultNavigationTimeout(this.timeout);

      logger.info('Crawler initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize crawler', { error });
      throw error;
    }
  }

  async crawlSite(
    startUrl: string,
    options: {
      maxPages?: number;
      includePatterns?: RegExp[];
      excludePatterns?: RegExp[];
      sameDomain?: boolean;
    } = {}
  ): Promise<CrawlResult[]> {
    const endTimer = performanceLogger.start(`crawl-site-${startUrl}`);
    
    try {
      if (!this.browser || !this.context) {
        await this.init();
      }

      const {
        maxPages = this.maxPages,
        includePatterns = crawlerConfig.includePatterns,
        excludePatterns = crawlerConfig.ignorePatterns,
        sameDomain = true,
      } = options;

      const results: CrawlResult[] = [];
      const urlsToVisit = [startUrl];
      const visitedUrls = new Set<string>();
      const baseUrl = new URL(startUrl);

      componentLogger.crawler.start(startUrl);

      while (urlsToVisit.length > 0 && results.length < maxPages) {
        const url = urlsToVisit.shift()!;
        
        if (visitedUrls.has(url)) continue;
        visitedUrls.add(url);

        try {
          const result = await this.crawlPage(url);
          if (result) {
            results.push(result);
            
            // Extract links for further crawling
            const links = this.extractLinks(result.htmlContent, url);
            const filteredLinks = this.filterLinks(
              links,
              baseUrl,
              includePatterns,
              excludePatterns,
              sameDomain
            );

            // Add new links to queue
            filteredLinks.forEach(link => {
              if (!visitedUrls.has(link) && !urlsToVisit.includes(link)) {
                urlsToVisit.push(link);
              }
            });
          }

          // Respectful crawling delay
          await this.sleep(this.delay);
        } catch (error) {
          componentLogger.crawler.error(url, error as Error);
          continue;
        }
      }

      endTimer();
      componentLogger.crawler.success(
        startUrl,
        results.length,
        results.reduce((sum, r) => sum + r.contentSize, 0)
      );

      return results;
    } catch (error) {
      endTimer();
      componentLogger.crawler.error(startUrl, error as Error);
      throw error;
    }
  }

  async crawlPage(url: string): Promise<CrawlResult | null> {
    if (!this.context) {
      throw new Error('Crawler not initialized');
    }

    const page = await this.context.newPage();
    const startTime = Date.now();

    try {
      // Navigate to page
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: this.timeout,
      });

      if (!response) {
        throw new Error('Failed to load page');
      }

      const statusCode = response.status();
      const loadTime = Date.now() - startTime;

      // Get page content
      const htmlContent = await page.content();
      const title = await page.title();
      
      // Extract text content
      const $ = load(htmlContent);
      const content = $('body').text().trim();
      const metaDescription = $('meta[name="description"]').attr('content') || '';

      // Get performance metrics
      const performanceMetrics = await this.getPerformanceMetrics(page);

      const result: CrawlResult = {
        url,
        title,
        content,
        htmlContent,
        metaDescription,
        statusCode,
        loadTime,
        contentSize: Buffer.byteLength(htmlContent, 'utf8'),
        performanceMetrics,
      };

      return result;
    } catch (error) {
      logger.error('Failed to crawl page', { url, error });
      return null;
    } finally {
      await page.close();
    }
  }

  private async getPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
    try {
      const performanceEntries = await page.evaluate(() => {
        return JSON.parse(JSON.stringify(performance.getEntriesByType('navigation')));
      });

      const paintEntries = await page.evaluate(() => {
        return JSON.parse(JSON.stringify(performance.getEntriesByType('paint')));
      });

      const layoutShifts = await page.evaluate(() => {
        return JSON.parse(JSON.stringify(performance.getEntriesByType('layout-shift')));
      });

      const navigation = performanceEntries[0];
      const fcp = paintEntries.find((entry: any) => entry.name === 'first-contentful-paint');
      const lcp = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            if (entries.length > 0) {
              resolve(entries[entries.length - 1].startTime);
            }
          }).observe({ entryTypes: ['largest-contentful-paint'] });
          
          setTimeout(() => resolve(0), 5000);
        });
      });

      const cls = layoutShifts.reduce((sum: number, entry: any) => {
        return sum + (entry.value || 0);
      }, 0);

      return {
        fcpScore: fcp?.startTime || 0,
        lcpScore: typeof lcp === 'number' ? lcp : 0,
        clsScore: cls,
      };
    } catch (error) {
      logger.error('Failed to get performance metrics', { error });
      return {};
    }
  }

  private extractLinks(html: string, baseUrl: string): string[] {
    const $ = load(html);
    const links: string[] = [];

    $('a[href]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        try {
          const absoluteUrl = new URL(href, baseUrl).href;
          links.push(absoluteUrl);
        } catch (error) {
          // Invalid URL, skip
        }
      }
    });

    return [...new Set(links)];
  }

  private filterLinks(
    links: string[],
    baseUrl: URL,
    includePatterns: RegExp[],
    excludePatterns: RegExp[],
    sameDomain: boolean
  ): string[] {
    return links.filter(link => {
      try {
        const url = new URL(link);

        // Same domain check
        if (sameDomain && url.hostname !== baseUrl.hostname) {
          return false;
        }

        // Exclude patterns
        if (excludePatterns.some(pattern => pattern.test(link))) {
          return false;
        }

        // Include patterns
        if (includePatterns.length > 0) {
          return includePatterns.some(pattern => pattern.test(link));
        }

        return true;
      } catch (error) {
        return false;
      }
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close(): Promise<void> {
    try {
      if (this.context) {
        await this.context.close();
        this.context = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      logger.info('Crawler closed successfully');
    } catch (error) {
      logger.error('Failed to close crawler', { error });
    }
  }
}

// Utility functions
export async function crawlSinglePage(url: string): Promise<CrawlResult | null> {
  const crawler = new WebCrawler();
  try {
    await crawler.init();
    return await crawler.crawlPage(url);
  } finally {
    await crawler.close();
  }
}

export async function crawlCompetitor(
  competitorUrl: string,
  maxPages: number = 5
): Promise<CrawlResult[]> {
  const crawler = new WebCrawler({ maxPages });
  try {
    await crawler.init();
    return await crawler.crawlSite(competitorUrl, { maxPages });
  } finally {
    await crawler.close();
  }
}

export default WebCrawler;