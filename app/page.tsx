'use client';

import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Target, 
  GitPullRequest, 
  TrendingUp, 
  Shield, 
  Clock, 
  ArrowRight, 
  Check, 
  Star,
  Play,
  BarChart3,
  Bot,
  Rocket,
  Globe,
  Users,
  Coffee,
  AlertTriangle,
  DollarSign,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Header from '../components/header';
import Footer from '../components/footer';
import PainPointShowcase from '../components/pain-point-showcase';
import InteractiveDemo from '../components/interactive-demo';

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Growth Lead at TechFlow",
      company: "TechFlow",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=64&h=64&fit=crop&crop=face",
      quote: "Nebula saved us 15 hours per week on optimization tasks. Our conversion rate increased 34% in the first month.",
      metrics: "+34% conversion rate"
    },
    {
      name: "Marcus Rodriguez",
      role: "Founder",
      company: "StartupBoost",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face", 
      quote: "The AI caught performance issues our team missed. We went from 2.1s to 0.8s page load time automatically.",
      metrics: "+162% faster loading"
    },
    {
      name: "Emily Watson",
      role: "Marketing Director",
      company: "EcomGrow",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      quote: "The competitor analysis feature is incredible. We implemented 5 critical changes that boosted revenue by $12k/month.",
      metrics: "+$12k monthly revenue"
    }
  ];

  const painPoints = [
    {
      icon: Clock,
      title: "Endless Manual Optimization",
      description: "Spending 10+ hours weekly juggling GA4, PageSpeed, and competitor research tools",
      cost: "10 hrs/week = $2,000/month in opportunity cost"
    },
    {
      icon: AlertTriangle,
      title: "Missing Revenue-Killing Issues",
      description: "Performance drops and conversion leaks go unnoticed until it's too late",
      cost: "Average site loses $5,000/month from undetected issues"
    },
    {
      icon: Users,
      title: "Falling Behind Competitors",
      description: "Rivals silently improve pricing, copy, and features while you stay static",
      cost: "Competitor advantages compound 15-20% annually"
    },
    {
      icon: Coffee,
      title: "Growth Team Burnout",
      description: "Talented people stuck on repetitive tasks instead of strategic initiatives",
      cost: "Top growth talent turnover costs $150k+ per hire"
    }
  ];

  const features = [
    {
      icon: Bot,
      title: "AI-Powered Analysis",
      description: "Claude AI analyzes your site vs competitors, identifying high-impact opportunities with revenue estimates",
      benefit: "Find $10k+ monthly opportunities automatically"
    },
    {
      icon: GitPullRequest,
      title: "Automated Pull Requests",
      description: "GitHub integration creates ready-to-merge code changes with A/B test suggestions",
      benefit: "Deploy optimizations in minutes, not days"
    },
    {
      icon: Shield,
      title: "Performance Guardrails",
      description: "Lighthouse monitoring prevents regressions with automatic rollback protection",
      benefit: "Never sacrifice speed for features again"
    },
    {
      icon: Globe,
      title: "Competitor Intelligence",
      description: "Track rival site changes and automatically respond with counter-optimizations",
      benefit: "Stay ahead of competition 24/7"
    },
    {
      icon: BarChart3,
      title: "Revenue Impact Tracking",
      description: "ML models predict monthly revenue delta for each optimization before deployment",
      benefit: "Prioritize changes by business impact"
    },
    {
      icon: Rocket,
      title: "Dark Mode Dashboard",
      description: "Beautiful, responsive interface optimized for growth teams and agencies",
      benefit: "Modern UX that scales with your business"
    }
  ];

  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4 mr-2" />
                Autonomous Website Optimization
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-dark-50 via-primary-dark to-secondary-dark bg-clip-text text-transparent leading-tight">
                Wake Up to a<br />
                <span className="text-gradient">Faster, Better Website</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-text-dark-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
                Nebula Growth Agent <strong>autonomously detects, decides, and deploys</strong> website optimizations while you sleep. 
                No dashboards, no tickets—just continuous growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 flex items-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button className="border border-border-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-dark transition-colors flex items-center">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </button>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-8 text-text-dark-secondary">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-success-dark mr-2" />
                  14-day free trial
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-success-dark mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-success-dark mr-2" />
                  Setup in 5 minutes
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero Stats */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold text-success-dark mb-2">$420k+</div>
              <div className="text-text-dark-secondary">Revenue generated for customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-dark mb-2">87%</div>
              <div className="text-text-dark-secondary">Average performance improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary-dark mb-2">15hrs</div>
              <div className="text-text-dark-secondary">Saved per week per team</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <PainPointShowcase painPoints={painPoints} />

      {/* Interactive Demo */}
      <InteractiveDemo />

      {/* How It Works */}
      <section className="py-20 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark-50">
              Autonomous Growth in <span className="text-gradient">3 Simple Steps</span>
            </h2>
            <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto">
              Set it once, then wake up to continuous optimizations and revenue growth
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sense",
                description: "Nightly Playwright crawls your site + competitors. GA4 anomaly detection catches revenue-killing issues within 24 hours.",
                icon: Globe,
                features: ["Competitor price monitoring", "Performance regression alerts", "Content change detection"]
              },
              {
                step: "02", 
                title: "Think",
                description: "Claude AI analyzes crawl data with RAG context. Ranks opportunities by estimated monthly revenue impact ($50-$5000+).",
                icon: Bot,
                features: ["Revenue impact scoring", "Competitor intelligence", "SEO optimization suggestions"]
              },
              {
                step: "03",
                title: "Act", 
                description: "GitHub App creates PRs with fixes. Lighthouse gates prevent regressions. Auto-merge ships improvements safely.",
                icon: GitPullRequest,
                features: ["Automated pull requests", "Performance guardrails", "Rollback protection"]
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-dark-800 rounded-2xl p-8 border border-border-dark hover:border-primary-dark transition-colors">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mr-4">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-text-dark-secondary">{step.step}</div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-dark-50 mb-4">{step.title}</h3>
                  <p className="text-text-dark-secondary mb-6 leading-relaxed">{step.description}</p>
                  
                  <ul className="space-y-2">
                    {step.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-text-dark-secondary">
                        <Check className="w-4 h-4 text-success-dark mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary-dark" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark-50">
              Everything You Need for <span className="text-gradient">Autonomous Growth</span>
            </h2>
            <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto">
              Built for modern growth teams who want results, not busywork
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-surface-dark rounded-2xl p-8 border border-border-dark hover:border-primary-dark transition-all hover:transform hover:scale-105">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-dark-50 mb-4">{feature.title}</h3>
                <p className="text-text-dark-secondary mb-4 leading-relaxed">{feature.description}</p>
                
                <div className="bg-dark-800 rounded-lg p-3 text-sm text-success-dark font-medium">
                  ✓ {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-surface-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark-50">
              Trusted by <span className="text-gradient">Growth Leaders</span>
            </h2>
            <div className="flex justify-center items-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-warning-dark fill-current" />
              ))}
              <span className="ml-3 text-text-dark-secondary">4.9/5 from 127 reviews</span>
            </div>
          </div>
          
          <div className="bg-dark-800 rounded-2xl p-8 border border-border-dark max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full"
                />
              </div>
              
              <blockquote className="text-xl md:text-2xl text-dark-50 mb-6 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium inline-block mb-4">
                {testimonials[currentTestimonial].metrics}
              </div>
              
              <div className="text-text-dark-secondary">
                <div className="font-semibold text-dark-50">{testimonials[currentTestimonial].name}</div>
                <div>{testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary-dark' : 'bg-dark-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark-50">
              Choose Your <span className="text-gradient">Growth Plan</span>
            </h2>
            <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto">
              From solo founders to enterprise teams—there's a plan that scales with your ambition
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "forever",
                description: "Perfect for hobby projects and early-stage startups",
                features: [
                  "1 website",
                  "50 pages crawled",
                  "Weekly analysis",
                  "PDF audit reports",
                  "Manual PR creation",
                  "Email support"
                ],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Pro",
                price: "$79",
                period: "per month",
                description: "Ideal for growing SaaS and e-commerce businesses",
                features: [
                  "5 websites",
                  "10k pages crawled",
                  "Nightly analysis",
                  "Auto-merge PRs",
                  "SGE answer blocks",
                  "Wallet pass generator",
                  "3 competitors tracked",
                  "Slack integration"
                ],
                cta: "Start 14-Day Trial",
                popular: true
              },
              {
                name: "Agency",
                price: "$299",
                period: "per month", 
                description: "Built for agencies managing multiple client sites",
                features: [
                  "25 websites",
                  "25k pages crawled",
                  "Hourly monitoring",
                  "White-label dashboard",
                  "API access",
                  "Custom branding",
                  "5 competitors per site",
                  "Priority support"
                ],
                cta: "Contact Sales",
                popular: false
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "pricing",
                description: "For large organizations with complex requirements",
                features: [
                  "Unlimited websites",
                  "Unlimited pages",
                  "Real-time monitoring",
                  "SSO integration",
                  "Custom AI models",
                  "Dedicated support",
                  "SLA guarantees",
                  "On-premise option"
                ],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <div key={index} className={`relative bg-surface-dark rounded-2xl p-8 border transition-all hover:transform hover:scale-105 ${
                plan.popular ? 'border-primary-dark ring-2 ring-primary-dark ring-opacity-50' : 'border-border-dark'
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-dark-50 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-dark-50">{plan.price}</span>
                    {plan.period !== 'pricing' && (
                      <span className="text-text-dark-secondary">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-text-dark-secondary text-sm">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-text-dark-secondary">
                      <Check className="w-4 h-4 text-success-dark mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular 
                    ? 'bg-gradient-primary text-white hover:opacity-90' 
                    : 'border border-border-dark text-text-dark hover:bg-dark-800'
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-text-dark-secondary mb-4">
              All plans include our core growth engine and 99.9% uptime SLA
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-text-dark-secondary">
              <div className="flex items-center">
                <Check className="w-4 h-4 text-success-dark mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-success-dark mr-2" />
                30-day money back
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 text-success-dark mr-2" />
                Migration assistance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%236366f1" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="3"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
            Ready to <span className="text-gradient">10x Your Growth</span>?
          </h2>
          <p className="text-xl text-text-dark-secondary mb-8 max-w-2xl mx-auto">
            Join 500+ growth teams who've automated their optimization workflow. 
            Start your free trial today—no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 flex items-center">
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="border border-border-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-dark transition-colors">
              Schedule Demo
            </button>
          </div>
          
          <p className="text-sm text-text-dark-secondary">
            🚀 Setup takes less than 5 minutes • 🔒 SOC 2 compliant • 🛡️ GDPR ready
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}