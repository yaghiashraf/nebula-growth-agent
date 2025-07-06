'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Zap, Shield, ChevronDown } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { 
      name: 'Product', 
      href: '#',
      dropdown: [
        { name: 'Features', href: '/#features', description: 'Complete growth automation suite' },
        { name: 'Demo', href: '/demo', description: 'See Nebula in action' },
        { name: 'Integrations', href: '/integrations', description: 'GitHub, GA4, Slack & more' },
        { name: 'API', href: '/api', description: 'Developer documentation' }
      ]
    },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Customers', href: '/#customers' },
    { name: 'Resources', href: '#', dropdown: [
      { name: 'Documentation', href: '/docs', description: 'Setup guides and tutorials' },
      { name: 'Blog', href: '/blog', description: 'Growth tips and case studies' },
      { name: 'Security', href: '/security', description: 'SOC 2 compliance & privacy' },
      { name: 'Status', href: 'https://status.nebula-growth.com', description: 'System uptime and health' }
    ]},
    { name: 'Company', href: '#', dropdown: [
      { name: 'About', href: '/about', description: 'Our mission and team' },
      { name: 'Careers', href: '/careers', description: 'Join our remote team' },
      { name: 'Contact', href: '/contact', description: 'Get in touch' }
    ]}
  ];

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-dark-900/95 backdrop-blur-xl border-b border-border-dark' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-dark-50">Nebula</div>
                <div className="text-xs text-text-dark-secondary -mt-1">Growth Agent</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.dropdown ? (
                  <div>
                    <button className="flex items-center text-text-dark hover:text-dark-50 transition-colors font-medium">
                      {item.name}
                      <ChevronDown className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-0 mt-2 w-80 bg-dark-800 border border-border-dark rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                      <div className="p-4">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block p-3 rounded-lg hover:bg-dark-700 transition-colors"
                          >
                            <div className="font-medium text-dark-50 mb-1">{subItem.name}</div>
                            <div className="text-sm text-text-dark-secondary">{subItem.description}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    href={item.href} 
                    className="text-text-dark hover:text-dark-50 transition-colors font-medium"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Security Badge & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center bg-dark-800 px-3 py-2 rounded-lg">
              <Shield className="w-4 h-4 text-success-dark mr-2" />
              <span className="text-xs text-text-dark-secondary">SOC 2 Certified</span>
            </div>
            
            <Link 
              href="/login"
              className="text-text-dark hover:text-dark-50 transition-colors font-medium"
            >
              Sign In
            </Link>
            
            <Link 
              href="/signup"
              className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-text-dark hover:text-dark-50 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-dark-900/98 backdrop-blur-xl border-b border-border-dark">
            <div className="p-6 space-y-6">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <div className="text-dark-50 font-medium mb-3">{item.name}</div>
                      <div className="pl-4 space-y-3">
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="block text-text-dark-secondary hover:text-dark-50 transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-dark-50 font-medium hover:text-primary-dark transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-6 border-t border-border-dark space-y-4">
                <div className="flex items-center bg-dark-800 px-3 py-2 rounded-lg w-fit">
                  <Shield className="w-4 h-4 text-success-dark mr-2" />
                  <span className="text-xs text-text-dark-secondary">SOC 2 Certified</span>
                </div>
                
                <div className="space-y-3">
                  <Link
                    href="/login"
                    className="block text-text-dark hover:text-dark-50 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  
                  <Link
                    href="/signup"
                    className="block bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}