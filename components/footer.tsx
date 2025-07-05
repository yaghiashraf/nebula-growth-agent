'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Shield, Heart, Globe, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Demo', href: '#demo' },
        { name: 'Integrations', href: '/integrations' },
        { name: 'API Documentation', href: '/api' },
        { name: 'Changelog', href: '/changelog' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Blog', href: '/blog' },
        { name: 'Press Kit', href: '/press' },
        { name: 'Partners', href: '/partners' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Community', href: '/community' },
        { name: 'Webinars', href: '/webinars' },
        { name: 'Case Studies', href: '/case-studies' },
        { name: 'Templates', href: '/templates' }
      ]
    },
    {
      title: 'Legal & Security',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'GDPR Compliance', href: '/gdpr' },
        { name: 'Security', href: '/security' },
        { name: 'Data Processing', href: '/dpa' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/nebula_growth', icon: Twitter },
    { name: 'GitHub', href: 'https://github.com/nebula-growth-agent', icon: Github },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/nebula-growth', icon: Linkedin },
    { name: 'Email', href: 'mailto:hello@nebula-growth.com', icon: Mail }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', badge: '🔒' },
    { name: 'GDPR Compliant', badge: '🇪🇺' },
    { name: 'ISO 27001', badge: '🛡️' },
    { name: 'CCPA Ready', badge: '🏛️' }
  ];

  return (
    <footer className="bg-dark-900 border-t border-border-dark">
      {/* Newsletter Section */}
      <div className="border-b border-border-dark">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-8 lg:mb-0">
              <h3 className="text-2xl font-bold text-dark-50 mb-2">
                Stay ahead of the growth curve
              </h3>
              <p className="text-text-dark-secondary max-w-md">
                Get weekly insights on AI-powered optimization, competitor intelligence, and conversion tactics.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark min-w-80"
              />
              <button className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-dark-50">Nebula Growth Agent</div>
                <div className="text-xs text-text-dark-secondary">Autonomous Website Optimization</div>
              </div>
            </Link>
            
            <p className="text-text-dark-secondary mb-6 leading-relaxed">
              The only growth platform that autonomously detects, decides, and deploys website optimizations. 
              Wake up to a faster, more profitable website every day.
            </p>
            
            {/* Security Certifications */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-dark-50 mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-success-dark" />
                Security & Compliance
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center text-xs text-text-dark-secondary">
                    <span className="mr-2">{cert.badge}</span>
                    {cert.name}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-dark-800 border border-border-dark rounded-lg flex items-center justify-center text-text-dark-secondary hover:text-dark-50 hover:border-primary-dark transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-sm font-semibold text-dark-50 mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-text-dark-secondary hover:text-dark-50 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-dark">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
              <div className="text-sm text-text-dark-secondary">
                © {currentYear} Nebula Growth Agent. All rights reserved.
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-text-dark-secondary">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success-dark rounded-full mr-2"></div>
                  All systems operational
                </div>
                <Link href="/status" className="hover:text-dark-50 transition-colors">
                  Status Page
                </Link>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-xs text-text-dark-secondary">
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="hover:text-dark-50 transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-dark-50 transition-colors">Terms</Link>
                <Link href="/cookies" className="hover:text-dark-50 transition-colors">Cookies</Link>
                <Link href="/sitemap" className="hover:text-dark-50 transition-colors">Sitemap</Link>
              </div>
              
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                <select className="bg-transparent text-text-dark-secondary text-xs focus:outline-none">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GDPR Notice */}
      <div id="cookie-notice" className="fixed bottom-0 left-0 right-0 bg-dark-900 border-t border-border-dark p-4 z-40 hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-text-dark-secondary mb-4 md:mb-0">
            We use cookies to enhance your experience and analyze site usage. 
            <Link href="/cookies" className="text-primary-dark hover:text-primary-light ml-1">
              Learn more
            </Link>
          </div>
          <div className="flex space-x-4">
            <button 
              id="accept-cookies"
              className="bg-gradient-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Accept All
            </button>
            <button 
              id="customize-cookies"
              className="border border-border-dark text-text-dark px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-800 transition-colors"
            >
              Customize
            </button>
          </div>
        </div>
      </div>

      {/* Made with Love */}
      <div className="bg-dark-950 py-3">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center text-xs text-text-dark-secondary">
            Made with <Heart className="w-3 h-3 mx-1 text-error-dark fill-current" /> by growth hackers, for growth hackers
          </div>
        </div>
      </div>

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Nebula Growth Agent',
            description: 'Autonomous website optimization platform that detects, decides, and deploys growth improvements automatically',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
              availability: 'https://schema.org/InStock'
            },
            publisher: {
              '@type': 'Organization',
              name: 'Nebula Growth Agent',
              url: 'https://nebula-growth.com'
            }
          })
        }}
      />
    </footer>
  );
}