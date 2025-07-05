'use client';

import React from 'react';
import { Shield, Lock, Eye, FileText, Award, CheckCircle } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function SecurityPage() {
  const certifications = [
    {
      name: 'SOC 2 Type II',
      description: 'Independently audited for security, availability, and confidentiality',
      icon: Award,
      status: 'Certified',
      date: '2024',
      detail: 'Annual third-party security audit covering all data processing activities'
    },
    {
      name: 'GDPR Compliant',
      description: 'Full compliance with European data protection regulations',
      icon: Shield,
      status: 'Compliant',
      date: '2024',
      detail: 'Right to access, rectify, delete, and port your personal data'
    },
    {
      name: 'ISO 27001',
      description: 'International standard for information security management',
      icon: Lock,
      status: 'Certified',
      date: '2024',
      detail: 'Systematic approach to managing sensitive information'
    },
    {
      name: 'CCPA Ready',
      description: 'California Consumer Privacy Act compliance framework',
      icon: Eye,
      status: 'Compliant',
      date: '2024',
      detail: 'Transparent data collection with consumer choice controls'
    }
  ];

  const securityMeasures = [
    {
      category: 'Data Encryption',
      measures: [
        'AES-256 encryption for data at rest',
        'TLS 1.3 for data in transit',
        'End-to-end encryption for sensitive communications',
        'Hardware security modules (HSMs) for key management'
      ]
    },
    {
      category: 'Access Controls',
      measures: [
        'Multi-factor authentication (MFA) required',
        'Role-based access control (RBAC)',
        'Zero-trust network architecture',
        'Regular access reviews and de-provisioning'
      ]
    },
    {
      category: 'Infrastructure Security',
      measures: [
        'Regular security patches and updates',
        'Intrusion detection and prevention systems',
        'Distributed denial-of-service (DDoS) protection',
        'Security information and event management (SIEM)'
      ]
    },
    {
      category: 'Application Security',
      measures: [
        'Static and dynamic application security testing',
        'Dependency vulnerability scanning',
        'Regular penetration testing',
        'Secure code review processes'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center bg-success-dark/10 border border-success-dark/20 text-success-dark px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise-Grade Security
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
              Your Data is <span className="text-gradient">Our Priority</span>
            </h1>
            
            <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto leading-relaxed">
              Nebula Growth Agent implements world-class security practices to protect your business data, 
              website analytics, and optimization insights with enterprise-grade controls.
            </p>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark-50">
                Security Certifications & Compliance
              </h2>
              <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto">
                Independently verified security standards that protect your data and ensure regulatory compliance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {certifications.map((cert, index) => {
                const IconComponent = cert.icon;
                return (
                  <div key={index} className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-success-dark/20 rounded-xl flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-success-dark" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-dark-50">{cert.name}</h3>
                          <span className="bg-success-dark/20 text-success-dark px-2 py-1 rounded-lg text-xs font-medium">
                            {cert.status}
                          </span>
                        </div>
                        <p className="text-text-dark-secondary mb-3">{cert.description}</p>
                        <p className="text-sm text-text-dark-secondary/80">{cert.detail}</p>
                        <div className="text-xs text-text-dark-secondary mt-2">
                          Last updated: {cert.date}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security Measures */}
        <section className="py-20 bg-surface-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark-50">
                Comprehensive Security Controls
              </h2>
              <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto">
                Multi-layered security architecture protecting every aspect of your data and our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {securityMeasures.map((category, index) => (
                <div key={index} className="bg-dark-800 rounded-2xl p-8 border border-border-dark">
                  <h3 className="text-xl font-bold text-dark-50 mb-6">{category.category}</h3>
                  <ul className="space-y-3">
                    {category.measures.map((measure, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-success-dark mt-0.5 flex-shrink-0" />
                        <span className="text-text-dark-secondary">{measure}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Protection */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-dark-50">
                  How We Protect Your Data
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-dark/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-primary-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-50 mb-2">Data Minimization</h3>
                      <p className="text-text-dark-secondary">We only collect data necessary for optimization and delete it when no longer needed.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-dark/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-primary-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-50 mb-2">Transparent Processing</h3>
                      <p className="text-text-dark-secondary">Clear documentation of what data we process, why, and how long we retain it.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary-dark/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-primary-dark" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark-50 mb-2">Your Rights</h3>
                      <p className="text-text-dark-secondary">Access, correct, delete, or export your data at any time through our self-service portal.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
                <h3 className="text-xl font-bold text-dark-50 mb-6">Data Processing Locations</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-dark-800 rounded-lg">
                    <span className="text-text-dark-secondary">Primary Infrastructure</span>
                    <span className="text-dark-50 font-medium">US East (Virginia)</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-dark-800 rounded-lg">
                    <span className="text-text-dark-secondary">Backup & Recovery</span>
                    <span className="text-dark-50 font-medium">US West (Oregon)</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-dark-800 rounded-lg">
                    <span className="text-text-dark-secondary">EU Data Residency</span>
                    <span className="text-dark-50 font-medium">Frankfurt, Germany</span>
                  </div>
                  <div className="text-xs text-text-dark-secondary mt-4">
                    * EU customers' data is processed and stored exclusively within the EU
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Incident Response */}
        <section className="py-20 bg-surface-dark">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-dark-50">
              Security Incident Response
            </h2>
            <p className="text-xl text-text-dark-secondary mb-12">
              Our 24/7 security operations center monitors for threats and responds to incidents within minutes
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-dark mb-2">&lt; 15min</div>
                <div className="text-sm text-text-dark-secondary">Detection Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-dark mb-2">&lt; 1hr</div>
                <div className="text-sm text-text-dark-secondary">Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-dark mb-2">24/7</div>
                <div className="text-sm text-text-dark-secondary">Monitoring</div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Contact */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-dark-800 rounded-2xl p-8 border border-border-dark text-center">
              <h2 className="text-2xl font-bold text-dark-50 mb-4">
                Security Questions or Concerns?
              </h2>
              <p className="text-text-dark-secondary mb-8">
                Our security team is here to help. Report vulnerabilities, request security documentation, 
                or ask questions about our security practices.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="mailto:security@nebula-growth.com"
                  className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  Contact Security Team
                </a>
                <a 
                  href="/security-docs"
                  className="border border-border-dark text-text-dark px-6 py-3 rounded-xl font-semibold hover:bg-surface-dark transition-colors"
                >
                  Security Documentation
                </a>
              </div>
              
              <div className="mt-8 text-sm text-text-dark-secondary">
                <p>For security vulnerabilities, please use our responsible disclosure process:</p>
                <p className="font-mono text-xs mt-2">security@nebula-growth.com (PGP: 0x1234567890ABCDEF)</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}