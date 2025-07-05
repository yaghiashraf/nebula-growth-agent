import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.CLAUDE_API_KEY = 'test-claude-key';
process.env.GITHUB_APP_ID = 'test-github-app-id';
process.env.GITHUB_PRIVATE_KEY = 'test-github-private-key';
process.env.GA4_MEASUREMENT_ID = 'test-ga4-measurement-id';
process.env.GA4_API_SECRET = 'test-ga4-api-secret';

// Mock external dependencies
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn().mockResolvedValue({
      newContext: jest.fn().mockResolvedValue({
        newPage: jest.fn().mockResolvedValue({
          goto: jest.fn(),
          content: jest.fn().mockResolvedValue('<html><body>Test content</body></html>'),
          screenshot: jest.fn(),
          close: jest.fn(),
        }),
        close: jest.fn(),
      }),
      close: jest.fn(),
    }),
  },
}));

jest.mock('lighthouse', () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    lhr: {
      categories: {
        performance: { score: 0.95 },
        accessibility: { score: 0.98 },
        'best-practices': { score: 0.92 },
        seo: { score: 0.88 },
      },
      audits: {
        'cumulative-layout-shift': { numericValue: 0.02 },
        'largest-contentful-paint': { numericValue: 1200 },
        'first-contentful-paint': { numericValue: 800 },
      },
    },
  }),
}));

jest.mock('chrome-launcher', () => ({
  launch: jest.fn().mockResolvedValue({
    port: 9222,
    kill: jest.fn(),
  }),
}));

// Mock OpenAI
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    embeddings: {
      create: jest.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0.1) }],
      }),
    },
  })),
}));

// Mock Anthropic
jest.mock('@anthropic-ai/sdk', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ text: 'Test AI response' }],
      }),
    },
  })),
}));

// Mock GitHub API
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    rest: {
      pulls: {
        create: jest.fn().mockResolvedValue({
          data: { number: 123, html_url: 'https://github.com/test/repo/pull/123' },
        }),
      },
      repos: {
        createOrUpdateFileContents: jest.fn().mockResolvedValue({
          data: { commit: { sha: 'abc123' } },
        }),
      },
    },
  })),
}));

// Global test utilities
global.mockConsole = () => {
  const originalConsole = console;
  beforeEach(() => {
    global.console = {
      ...originalConsole,
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };
  });
  afterEach(() => {
    global.console = originalConsole;
  });
};