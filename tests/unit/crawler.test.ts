import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import WebCrawler, { crawlSinglePage } from '../../src/crawler';

// Mock console methods to avoid noise in tests
global.mockConsole();

describe('WebCrawler', () => {
  let crawler: WebCrawler;

  beforeEach(() => {
    crawler = new WebCrawler({
      maxPages: 5,
      delay: 100,
      timeout: 5000,
    });
  });

  afterEach(async () => {
    await crawler.close();
  });

  describe('initialization', () => {
    it('should initialize crawler successfully', async () => {
      await expect(crawler.init()).resolves.not.toThrow();
    });

    it('should handle initialization errors gracefully', async () => {
      // Mock chromium.launch to throw an error
      const { chromium } = require('playwright');
      chromium.launch.mockRejectedValueOnce(new Error('Failed to launch browser'));

      await expect(crawler.init()).rejects.toThrow('Failed to launch browser');
    });
  });

  describe('crawlPage', () => {
    beforeEach(async () => {
      await crawler.init();
    });

    it('should crawl a single page successfully', async () => {
      const url = 'https://example.com';
      const result = await crawler.crawlPage(url);

      expect(result).toBeDefined();
      expect(result?.url).toBe(url);
      expect(result?.statusCode).toBe(200);
      expect(result?.content).toBeDefined();
      expect(result?.htmlContent).toBeDefined();
      expect(result?.loadTime).toBeGreaterThan(0);
      expect(result?.contentSize).toBeGreaterThan(0);
    });

    it('should handle page load failures', async () => {
      const url = 'https://invalid-domain-that-does-not-exist.com';
      const result = await crawler.crawlPage(url);

      expect(result).toBeNull();
    });

    it('should extract performance metrics', async () => {
      const url = 'https://example.com';
      const result = await crawler.crawlPage(url);

      expect(result?.performanceMetrics).toBeDefined();
      expect(typeof result?.performanceMetrics?.fcpScore).toBe('number');
      expect(typeof result?.performanceMetrics?.lcpScore).toBe('number');
      expect(typeof result?.performanceMetrics?.clsScore).toBe('number');
    });
  });

  describe('crawlSite', () => {
    beforeEach(async () => {
      await crawler.init();
    });

    it('should crawl multiple pages from a site', async () => {
      const url = 'https://example.com';
      const results = await crawler.crawlSite(url, { maxPages: 3 });

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
      expect(results.length).toBeLessThanOrEqual(3);
    });

    it('should respect maxPages limit', async () => {
      const url = 'https://example.com';
      const maxPages = 2;
      const results = await crawler.crawlSite(url, { maxPages });

      expect(results.length).toBeLessThanOrEqual(maxPages);
    });

    it('should filter links correctly', async () => {
      const url = 'https://example.com';
      const results = await crawler.crawlSite(url, {
        maxPages: 5,
        sameDomain: true,
        excludePatterns: [/\/admin/],
      });

      results.forEach(result => {
        expect(result.url).not.toMatch(/\/admin/);
        expect(new URL(result.url).hostname).toBe('example.com');
      });
    });
  });

  describe('utility functions', () => {
    it('should crawl single page using utility function', async () => {
      const url = 'https://example.com';
      const result = await crawlSinglePage(url);

      expect(result).toBeDefined();
      expect(result?.url).toBe(url);
    });
  });

  describe('error handling', () => {
    it('should handle network timeouts', async () => {
      const shortTimeoutCrawler = new WebCrawler({ timeout: 1 }); // 1ms timeout
      await shortTimeoutCrawler.init();

      const result = await shortTimeoutCrawler.crawlPage('https://httpbin.org/delay/5');
      expect(result).toBeNull();

      await shortTimeoutCrawler.close();
    });

    it('should handle malformed URLs', async () => {
      await crawler.init();
      const result = await crawler.crawlPage('not-a-valid-url');
      expect(result).toBeNull();
    });
  });

  describe('performance', () => {
    it('should complete crawling within reasonable time', async () => {
      const start = Date.now();
      await crawler.init();
      await crawler.crawlPage('https://example.com');
      const duration = Date.now() - start;

      expect(duration).toBeLessThan(10000); // 10 seconds
    });

    it('should respect crawl delay', async () => {
      const crawler = new WebCrawler({ delay: 1000 });
      await crawler.init();

      const start = Date.now();
      await crawler.crawlSite('https://example.com', { maxPages: 2 });
      const duration = Date.now() - start;

      // Should take at least 1 second due to delay
      expect(duration).toBeGreaterThan(1000);

      await crawler.close();
    });
  });
});