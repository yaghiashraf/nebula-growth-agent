import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nebula Growth Agent - Autonomous Website Optimization',
  description: 'The only growth platform that autonomously detects, decides, and deploys website optimizations. Wake up to a faster, more profitable website every day.',
  keywords: [
    'website optimization',
    'growth automation',
    'AI website analysis',
    'conversion rate optimization',
    'automated A/B testing',
    'competitor analysis',
    'performance monitoring',
    'GitHub automation',
    'growth hacking',
    'revenue optimization'
  ],
  authors: [{ name: 'Nebula Growth Agent Team' }],
  creator: 'Nebula Growth Agent',
  publisher: 'Nebula Growth Agent',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nebula-growth.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'es-ES': '/es-ES',
      'fr-FR': '/fr-FR',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nebula-growth.com',
    title: 'Nebula Growth Agent - Autonomous Website Optimization',
    description: 'Wake up to a faster, more profitable website every day. Nebula autonomously detects, decides, and deploys optimizations while you sleep.',
    siteName: 'Nebula Growth Agent',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nebula Growth Agent - Autonomous Website Optimization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nebula Growth Agent - Autonomous Website Optimization',
    description: 'Wake up to a faster, more profitable website every day. Nebula autonomously detects, decides, and deploys optimizations while you sleep.',
    site: '@nebula_growth',
    creator: '@nebula_growth',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#6366f1',
      },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'msapplication-TileColor': '#111827',
    'theme-color': '#111827',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://api.openai.com https://api.anthropic.com https://www.google-analytics.com; frame-src 'self';" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
        
        {/* Privacy & GDPR */}
        <meta name="privacy-policy" content="/privacy" />
        <meta name="terms-of-service" content="/terms" />
        <meta name="cookie-policy" content="/cookies" />
        <meta name="gdpr-compliance" content="/gdpr" />
        
        {/* Verification */}
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msvalidate.01" content="your-bing-verification-code" />
        
        {/* Favicon Links - Order matters for browser compatibility */}
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* DNS Prefetch for external domains */}
        <link rel="dns-prefetch" href="//api.openai.com" />
        <link rel="dns-prefetch" href="//api.anthropic.com" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Nebula Growth Agent',
              description: 'Autonomous website optimization platform that detects, decides, and deploys growth improvements automatically',
              url: 'https://nebula-growth.com',
              logo: 'https://nebula-growth.com/logo.png',
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-555-NEBULA',
                contactType: 'customer service',
                availableLanguage: ['en', 'es', 'fr', 'de']
              },
              sameAs: [
                'https://twitter.com/nebula_growth',
                'https://linkedin.com/company/nebula-growth',
                'https://github.com/nebula-growth-agent'
              ],
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'US',
                addressRegion: 'CA',
                addressLocality: 'San Francisco'
              }
            })
          }}
        />
        
        {/* Google Analytics 4 - GDPR Compliant */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // GDPR Compliant - only track if consent given
              if (localStorage.getItem('cookie-consent') === 'accepted') {
                gtag('config', 'G-XXXXXXXXXX', {
                  anonymize_ip: true,
                  cookie_flags: 'SameSite=Strict;Secure',
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false
                });
              }
            `,
          }}
        />
        
        {/* Cookie Consent Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (!localStorage.getItem('cookie-consent')) {
                  document.getElementById('cookie-notice')?.classList.remove('hidden');
                }
                
                document.getElementById('accept-cookies')?.addEventListener('click', function() {
                  localStorage.setItem('cookie-consent', 'accepted');
                  document.getElementById('cookie-notice')?.classList.add('hidden');
                  
                  // Initialize GA4 after consent
                  if (typeof gtag !== 'undefined') {
                    gtag('config', 'G-XXXXXXXXXX', {
                      anonymize_ip: true,
                      cookie_flags: 'SameSite=Strict;Secure'
                    });
                  }
                });
                
                document.getElementById('customize-cookies')?.addEventListener('click', function() {
                  window.location.href = '/cookies';
                });
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background-dark text-text-dark">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-gradient-primary text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        {/* Main content */}
        <main id="main-content">
          {children}
        </main>
        
        {/* Accessibility scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // High contrast mode detection
              if (window.matchMedia('(prefers-contrast: high)').matches) {
                document.documentElement.classList.add('high-contrast');
              }
              
              // Reduced motion detection
              if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                document.documentElement.classList.add('reduce-motion');
              }
              
              // Focus management for keyboard navigation
              document.addEventListener('keydown', function(e) {
                if (e.key === 'Tab') {
                  document.body.classList.add('keyboard-navigation');
                }
              });
              
              document.addEventListener('mousedown', function() {
                document.body.classList.remove('keyboard-navigation');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}