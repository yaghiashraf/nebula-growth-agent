'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app, this would send the contact form
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@nebula-growth.com',
      description: 'Send us an email anytime'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Chat with our support team'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM EST'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background-dark text-text-dark">
        <Header />
        <div className="pt-20 pb-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div className="bg-surface-dark rounded-2xl p-12 border border-border-dark">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-dark-50">Message Sent!</h1>
              <p className="text-text-dark-secondary mb-8">
                Thanks for reaching out. We'll get back to you within 24 hours.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="bg-gradient-primary text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
              Get in <span className="text-gradient">Touch</span>
            </h1>
            
            <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto">
              Have questions about Nebula? Want to see how we can help optimize your website? 
              We're here to help you automate your growth.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-surface-dark rounded-2xl p-8 border border-border-dark text-center">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-50 mb-2">{info.title}</h3>
                  <p className="text-primary-dark font-medium mb-2">{info.details}</p>
                  <p className="text-text-dark-secondary text-sm">{info.description}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
                <h2 className="text-2xl font-bold text-dark-50 mb-6">Send us a Message</h2>
                
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
                        className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
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
                        className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
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
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    >
                      <option value="general">General Question</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={5}
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark resize-none"
                      placeholder="Tell us more about your needs..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* FAQ Section */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-dark-50 mb-6">Quick Answers</h2>
                  
                  <div className="space-y-6">
                    {[
                      {
                        question: "How quickly can I get started?",
                        answer: "Setup takes less than 5 minutes. Just connect your GitHub repo and we'll start analyzing your site immediately."
                      },
                      {
                        question: "What if I need custom features?",
                        answer: "Our Enterprise plan includes custom AI model training and dedicated development resources for your specific needs."
                      },
                      {
                        question: "Do you offer technical support?",
                        answer: "Yes! We provide email support for all plans, with priority support for Pro+ customers and dedicated support for Enterprise."
                      },
                      {
                        question: "Can I see Nebula in action first?",
                        answer: "Absolutely! Schedule a live demo to see how Nebula can optimize your specific website and use case."
                      }
                    ].map((faq, index) => (
                      <div key={index} className="bg-dark-800 rounded-xl p-6 border border-border-dark">
                        <h3 className="font-semibold text-dark-50 mb-2">{faq.question}</h3>
                        <p className="text-text-dark-secondary text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-primary/10 border border-primary-dark/30 rounded-xl p-6">
                  <h3 className="font-semibold text-dark-50 mb-2">Enterprise Sales</h3>
                  <p className="text-text-dark-secondary text-sm mb-4">
                    Need a custom solution for your organization? Our enterprise team is ready to help.
                  </p>
                  <button 
                    onClick={() => window.open('https://calendly.com/nebula-growth/enterprise', '_blank')}
                    className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                  >
                    Schedule Enterprise Demo
                  </button>
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