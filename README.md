# 🚀 Nebula Growth Agent

**Autonomous "detect-decide-deploy" platform for website growth optimization**

Nebula Growth Agent automatically crawls your website and competitors, identifies high-impact growth opportunities using AI, and creates pull requests with optimizations. Wake up to a faster, more persuasive website—no dashboards, no tickets needed.

![Nebula Growth Agent Dashboard](docs/images/dashboard-preview.png)

## ✨ Features

### 🔍 **Sensor Layer**
- **Nightly Automated Crawling**: Playwright-powered crawling of target sites and competitors
- **GA4 Integration**: Automatic anomaly detection via Measurement Protocol
- **Performance Monitoring**: Real-time Lighthouse audits with regression detection

### 🧠 **Reasoning Core**
- **RAG-Powered Analysis**: OpenAI embeddings + Claude decision engine
- **Competitor Intelligence**: Cross-site learning from rival strategies
- **Revenue Impact Scoring**: AI-estimated monthly revenue delta for each opportunity

### ⚡ **Action Layer**
- **Automated PR Creation**: GitHub App integration with optional auto-merge
- **Asset Generation**: FAQ schema, optimized images, Apple/Google Wallet passes
- **Performance Guardrails**: Automatic rollback on CLS/speed regression

### 🎨 **Dark Mode UI**
- **Responsive Design**: Mobile-first with midnight-blue aesthetic (`#111827` base)
- **Real-time Analytics**: Live performance tracking and competitor analysis
- **Visual Diff Viewer**: Before/after comparisons with syntax highlighting

## 🏗️ Architecture

```
📦 nebula-growth-agent/
├── 🌐 netlify/functions/     # Serverless functions (nightly cron, deploy hooks)
├── 🧩 src/                  # Core business logic
│   ├── crawler.ts           # Playwright web scraping
│   ├── ga4.ts              # Google Analytics integration
│   ├── rag.ts              # AI reasoning engine
│   ├── patcher.ts          # GitHub PR automation
│   └── wallet.ts           # Asset generation
├── 🎨 components/           # React UI components (dark mode)
├── 🗄️ prisma/              # Database schema (Turso SQLite)
├── 🧪 tests/               # Unit & E2E test suites
└── 🔧 lib/                 # Utilities (config, logging, DB client)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- GitHub App (for PR automation)
- API keys: OpenAI, Anthropic Claude, GA4 (optional)

### 1. Clone & Install
```bash
git clone https://github.com/your-org/nebula-growth-agent.git
cd nebula-growth-agent
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="file:./dev.db"

# AI Services
OPENAI_API_KEY="sk-..."
CLAUDE_API_KEY="sk-ant-..."

# GitHub Integration
GITHUB_APP_ID="123456"
GITHUB_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."

# Optional: GA4 Integration
GA4_MEASUREMENT_ID="G-XXXXXXXXXX"
GA4_API_SECRET="xxxxxxxxxxxx"

# Feature Flags
AUTO_MERGE="false"  # Set to "true" for automatic PR merging
```

### 3. Database Setup
```bash
npm run db:generate
npm run db:push
```

### 4. Development Server
```bash
npm run dev
```

Visit `http://localhost:8888` to see the Netlify Dev environment with functions.

## 📋 Usage

### Adding a Site
```typescript
// Via API or dashboard
const site = await db.client.site.create({
  data: {
    url: 'https://your-website.com',
    name: 'My Website',
    userId: 'user-id',
    autoMerge: false,
    maxPages: 50,
    githubRepo: 'my-repo',
    githubOwner: 'my-username',
  }
});
```

### Manual Crawl Trigger
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/nightly \
  -H "Content-Type: application/json" \
  -d '{"siteId": "your-site-id"}'
```

### Adding Competitors
```typescript
await db.client.competitor.create({
  data: {
    siteId: 'your-site-id',
    url: 'https://competitor.com',
    name: 'Competitor Name',
  }
});
```

## 🎯 Opportunity Types

| Type | Description | Example Output |
|------|-------------|----------------|
| `COPY_TWEAK` | Headline/CTA optimization | "Change 'Learn More' to 'Get Started Free'" |
| `SEO_OPTIMIZATION` | Meta tags, headings | "Add H1 with target keyword 'best CRM software'" |
| `PERFORMANCE_FIX` | Image compression, caching | "Convert hero.jpg to WebP (67% size reduction)" |
| `UX_IMPROVEMENT` | Layout, navigation | "Move CTA above the fold on mobile" |
| `SGE_ANSWER_BLOCK` | Google SGE content | "Add FAQ section answering 'How does it work?'" |
| `FAQ_SCHEMA` | Structured data | "JSON-LD schema for 5 common questions" |
| `LOYALTY_PASS` | E-commerce wallet passes | "Apple Wallet loyalty card with point balance" |
| `COMPETITOR_RESPONSE` | Rival feature matching | "Add pricing comparison like CompetitorX" |

## 📊 Pricing Tiers

| Plan | Price | Limits | Features |
|------|-------|--------|----------|
| **Starter** | Free | 1 site, 50 pages, weekly scan | PDF audit, manual PRs |
| **Pro** | $79/mo | 10k pages, nightly scan, 3 competitors | Auto-merge, SGE blocks, wallet generator |
| **Agency** | $299/mo | 25 sites, hourly scan | White-label, API access, Slack integration |
| **Enterprise** | Custom | Unlimited | SSO, model fine-tuning, SLA |

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Lint & type check
npm run lint && npm run typecheck
```

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repo to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy triggers automatically on `main` branch pushes

### Manual Deployment
```bash
npm run build
netlify deploy --prod
```

### GitHub Actions
The included CI/CD pipeline handles:
- ✅ Linting & type checking
- 🧪 Unit & integration tests
- 🔒 Security scanning (Snyk)
- 🚀 Lighthouse performance audits
- 📦 Automatic deployment to staging/production
- 🔄 Database migrations
- 📱 Slack notifications

## 🔧 Configuration

### Performance Thresholds
```typescript
// lib/config.ts
export const performanceThresholds = {
  lighthouse: { minimum: 0.8 },    // 80% Lighthouse score
  cls: { maximum: 0.1 },           // 0.1 CLS threshold
  lcp: { maximum: 2500 },          // 2.5s LCP threshold
};
```

### Crawler Settings
```typescript
// lib/config.ts
export const crawlerConfig = {
  maxPages: 50,
  timeout: 30000,      // 30 seconds
  delay: 1000,         // 1 second between requests
  ignorePatterns: [/\/admin/, /\.pdf$/],
};
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Ensure all tests pass: `npm run test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Development Guidelines
- Follow the existing code style (ESLint + Prettier)
- Write tests for new features
- Update documentation for API changes
- Ensure TypeScript types are properly defined

## 📚 API Reference

### Netlify Functions

#### `POST /.netlify/functions/nightly`
Trigger crawling and opportunity generation.

**Request:**
```json
{
  "siteId": "string",
  "includeCompetitors": true
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "total": 5,
    "successful": 4,
    "failed": 1
  }
}
```

#### `POST /.netlify/functions/deploy-hook`
Performance monitoring and rollback.

**Request:**
```json
{
  "deploymentId": "string",
  "siteUrl": "https://example.com",
  "prNumber": 123
}
```

## 🛠️ Troubleshooting

### Common Issues

**"Failed to launch browser"**
```bash
# Install Playwright dependencies
npx playwright install --with-deps
```

**"Database connection failed"**
```bash
# Regenerate Prisma client
npm run db:generate
npm run db:push
```

**"API rate limit exceeded"**
- Check your OpenAI/Claude API usage
- Adjust `crawlerConfig.delay` for slower crawling

### Debug Mode
```bash
LOG_LEVEL=debug npm run dev
```

## 📈 Roadmap

- [ ] **Q1 2024**: White-label dashboard for agencies
- [ ] **Q2 2024**: Multi-language support (Spanish, French)
- [ ] **Q3 2024**: Advanced A/B testing integration
- [ ] **Q4 2024**: Custom ML model fine-tuning

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 💬 Support

- 📧 Email: support@nebula-growth-agent.com
- 💬 Discord: [Join our community](https://discord.gg/nebula-growth)
- 📖 Docs: [docs.nebula-growth-agent.com](https://docs.nebula-growth-agent.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/nebula-growth-agent/issues)

---

**Built with ❤️ for growth-focused teams**

*Nebula Growth Agent - Your autonomous website optimization partner*