'use client';

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Users, Coffee, TrendingDown, DollarSign, Timer, Zap } from 'lucide-react';

interface PainPoint {
  icon: any;
  title: string;
  description: string;
  cost: string;
}

interface PainPointShowcaseProps {
  painPoints: PainPoint[];
}

export default function PainPointShowcase({ painPoints }: PainPointShowcaseProps) {
  const [currentPain, setCurrentPain] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentPain(prev => (prev + 1) % painPoints.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [painPoints.length]);

  const stats = [
    { value: '73%', label: 'of growth teams burn out on manual tasks', trend: 'up' },
    { value: '$12k', label: 'average monthly revenue lost to unoptimized sites', trend: 'down' },
    { value: '15hrs', label: 'weekly time spent on repetitive optimization work', trend: 'up' },
    { value: '45%', label: 'of performance issues go undetected for weeks', trend: 'down' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-dark-950 to-dark-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%2523ef4444%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M0%200h100v100H0z%22%20fill%3D%22none%22/%3E%3Cpath%20d%3D%22M50%200v100M0%2050h100%22%20stroke%3D%22%2523ef4444%22%20stroke-width%3D%220.5%22/%3E%3C/g%3E%3C/svg%3E')]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-error-dark/10 border border-error-dark/20 text-error-dark px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4 mr-2" />
            The Hidden Cost of Manual Growth
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
            Are You <span className="text-error-dark">Bleeding Revenue</span><br />
            While Competitors Pull Ahead?
          </h2>
          
          <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto leading-relaxed">
            Every day you manually optimize is a day your competitors automate past you. 
            Here's what this "growth tax" is really costing your business.
          </p>
        </div>

        {/* Pain Point Stats */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <div key={index} className="bg-dark-800/50 backdrop-blur-sm border border-error-dark/20 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-error-dark">{stat.value}</span>
                {stat.trend === 'up' ? (
                  <TrendingDown className="w-5 h-5 text-error-dark ml-2 rotate-180" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-error-dark ml-2" />
                )}
              </div>
              <p className="text-sm text-text-dark-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Interactive Pain Points */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Pain Point Selector */}
          <div className="space-y-4">
            {painPoints.map((pain, index) => {
              const IconComponent = pain.icon;
              const isActive = currentPain === index;
              
              return (
                <div
                  key={index}
                  onClick={() => setCurrentPain(index)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-500 ${
                    isActive 
                      ? 'bg-error-dark/10 border-error-dark/30 transform scale-105' 
                      : 'bg-dark-800/30 border-border-dark hover:border-error-dark/20'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-error-dark text-white' : 'bg-dark-700 text-error-dark'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-2 transition-colors ${
                        isActive ? 'text-dark-50' : 'text-text-dark-secondary'
                      }`}>
                        {pain.title}
                      </h3>
                      <p className={`text-sm mb-3 transition-colors ${
                        isActive ? 'text-text-dark-secondary' : 'text-text-dark-secondary/70'
                      }`}>
                        {pain.description}
                      </p>
                      <div className={`text-xs font-medium transition-colors ${
                        isActive ? 'text-error-dark' : 'text-error-dark/70'
                      }`}>
                        💸 {pain.cost}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Showcase */}
          <div className="relative">
            <div className="bg-dark-800 rounded-2xl p-8 border border-border-dark">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-dark-50 mb-4">
                  The Manual Growth Nightmare
                </h3>
                <p className="text-text-dark-secondary">
                  Watch how manual optimization kills productivity and revenue
                </p>
              </div>

              {/* Animated Workflow */}
              <div className="space-y-6">
                {[
                  { icon: Timer, text: 'Check GA4 for anomalies', time: '45 min' },
                  { icon: Users, text: 'Research 3 competitors manually', time: '2 hrs' },
                  { icon: AlertTriangle, text: 'Find performance issues', time: '1.5 hrs' },
                  { icon: Coffee, text: 'Write fixes & create PRs', time: '3 hrs' },
                  { icon: TrendingDown, text: 'Wait for approvals & deployment', time: '2 days' }
                ].map((step, index) => {
                  const IconComponent = step.icon;
                  const isCurrentStep = index === (currentPain % 5);
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center p-4 rounded-xl transition-all duration-500 ${
                        isCurrentStep 
                          ? 'bg-error-dark/20 border border-error-dark/30 transform scale-105' 
                          : 'bg-dark-700/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-colors ${
                        isCurrentStep ? 'bg-error-dark text-white' : 'bg-dark-600 text-text-dark-secondary'
                      }`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-medium transition-colors ${
                          isCurrentStep ? 'text-dark-50' : 'text-text-dark-secondary'
                        }`}>
                          {step.text}
                        </div>
                      </div>
                      
                      <div className={`text-sm font-medium transition-colors ${
                        isCurrentStep ? 'text-error-dark' : 'text-text-dark-secondary/70'
                      }`}>
                        {step.time}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Cost */}
              <div className="mt-8 p-6 bg-error-dark/10 border border-error-dark/30 rounded-xl text-center">
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-6 h-6 text-error-dark mr-2" />
                  <span className="text-2xl font-bold text-error-dark">$3,200</span>
                </div>
                <p className="text-sm text-text-dark-secondary">
                  Weekly cost in lost time + missed opportunities
                </p>
              </div>
            </div>

            {/* Solution Hint */}
            <div className="absolute -bottom-6 -right-6 bg-gradient-primary p-4 rounded-xl shadow-2xl">
              <div className="flex items-center text-white">
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Nebula automates this in 15 minutes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-dark-50 mb-4">
            Stop the Revenue Bleeding
          </h3>
          <p className="text-text-dark-secondary mb-8 max-w-2xl mx-auto">
            Join 500+ growth teams who've eliminated the manual optimization tax and 
            automated their way to 34% higher conversion rates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity">
              See How Nebula Fixes This
            </button>
            <button className="border border-border-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-dark transition-colors">
              Calculate Your Growth Tax
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}