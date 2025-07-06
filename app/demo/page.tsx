'use client';

import React, { useState } from 'react';
import { Play, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import InteractiveDemo from '../../components/interactive-demo';

export default function DemoPage() {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    website: ''
  });

  const timeSlots = [
    '9:00 AM EST',
    '10:00 AM EST', 
    '11:00 AM EST',
    '2:00 PM EST',
    '3:00 PM EST',
    '4:00 PM EST'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would schedule the demo
    window.open('https://calendly.com/nebula-growth/demo', '_blank');
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Play className="w-4 h-4 mr-2" />
              Interactive Demo
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
              See Nebula <span className="text-gradient">Transform Your Website</span>
            </h1>
            
            <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto mb-8">
              Watch how our AI agent finds $2,840 in monthly revenue opportunities 
              and deploys the fixes automatically—all in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('interactive-demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Try Interactive Demo
              </button>
              <button 
                onClick={() => document.getElementById('schedule-demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-border-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-dark transition-colors"
              >
                Schedule Live Demo
              </button>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <div id="interactive-demo">
          <InteractiveDemo />
        </div>

        {/* Schedule Demo Section */}
        <section id="schedule-demo" className="py-20 bg-surface-dark">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark-50">
                Schedule a Personalized Demo
              </h2>
              <p className="text-xl text-text-dark-secondary">
                See how Nebula can optimize your specific website and industry
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Demo Form */}
              <div className="bg-dark-800 rounded-2xl p-8 border border-border-dark">
                <h3 className="text-xl font-bold text-dark-50 mb-6">Book Your Demo</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-dark-50 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-dark-700 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-dark-50 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-dark-700 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                        placeholder="john@company.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full bg-dark-700 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="Acme Inc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full bg-dark-700 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="https://yoursite.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Preferred Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            selectedTimeSlot === slot
                              ? 'bg-primary-dark text-white border-primary-dark'
                              : 'bg-dark-700 text-text-dark-secondary border-border-dark hover:bg-dark-600'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    Schedule Demo
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </form>
              </div>

              {/* Demo Benefits */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-dark-50 mb-4">What You'll See</h3>
                  <div className="space-y-4">
                    {[
                      'Live analysis of your actual website',
                      'Real optimization opportunities identified',
                      'Revenue impact calculations for your site',
                      'Demo of automated PR creation process',
                      'Q&A with our growth experts'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <span className="text-text-dark-secondary">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-dark-800 rounded-xl p-6 border border-border-dark">
                  <div className="flex items-center mb-4">
                    <Clock className="w-5 h-5 text-primary-dark mr-2" />
                    <span className="font-medium text-dark-50">30-minute session</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <Users className="w-5 h-5 text-primary-dark mr-2" />
                    <span className="font-medium text-dark-50">1-on-1 with expert</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-primary-dark mr-2" />
                    <span className="font-medium text-dark-50">Available same day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}