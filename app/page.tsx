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
  const [showDemo, setShowDemo] = useState(false);

  // Navigation helpers
  const handleStartFreeTrial = () => {
    // In a real app, this would navigate to signup page or trigger signup modal
    window.location.href = '/signup';
  };

  const handleScheduleDemo = () => {
    // In a real app, this would navigate to demo booking page
    window.location.href = '/demo';
  };

  const handlePlanSelection = (planName: string) => {
    if (planName === 'Starter') {
      // Handle free plan signup
      handleStartFreeTrial();
    } else if (planName === 'Pro' || planName === 'Agency') {
      // Navigate to pricing page for Stripe checkout
      window.location.href = '/pricing';
    } else {
      // Enterprise - contact sales
      window.location.href = '/contact';
    }
  };

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Growth Lead at TechFlow",
      company: "TechFlow",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=64&h=64&fit=crop&crop=face",
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

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%223%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
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
                <button 
                  onClick={handleStartFreeTrial}
                  className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 flex items-center"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button 
                  onClick={() => setShowDemo(true)}
                  className="border border-border-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-dark transition-colors flex items-center"
                >
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
                
                <button 
                  onClick={() => handlePlanSelection(plan.name)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    plan.popular 
                      ? 'bg-gradient-primary text-white hover:opacity-90' 
                      : 'border border-border-dark text-text-dark hover:bg-dark-800'
                  }`}
                >
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
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%236366f1%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%223%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
            Ready to <span className="text-gradient">10x Your Growth</span>?
          </h2>
          <p className="text-xl text-text-dark-secondary mb-8 max-w-2xl mx-auto">
            Join 500+ growth teams who've automated their optimization workflow. 
            Start your free trial today—no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={handleStartFreeTrial}
              className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 flex items-center"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button 
              onClick={handleScheduleDemo}
              className="border border-border-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-dark transition-colors"
            >
              Schedule Demo
            </button>
          </div>
          
          <p className="text-sm text-text-dark-secondary">
            🚀 Setup takes less than 5 minutes • 🔒 SOC 2 compliant • 🛡️ GDPR ready
          </p>
        </div>
      </section>

      <Footer />

      {/* Demo Modal */}
      {showDemo && (
        <DemoModal onClose={() => setShowDemo(false)} />
      )}
    </div>
  );
}

// Demo Modal Component
function DemoModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Navigation helper
  const handleStartFreeTrial = () => {
    window.location.href = '/signup';
  };

  const demoSteps = [
    {
      title: "🔍 AI Scans Your Website",
      description: "Nebula's AI crawls your site and identifies optimization opportunities",
      visual: "scanning",
      duration: 3000
    },
    {
      title: "📊 Analyzes Performance Data", 
      description: "Deep analysis of Core Web Vitals, SEO metrics, and user behavior",
      visual: "analyzing",
      duration: 3000
    },
    {
      title: "🎯 Generates Smart Suggestions",
      description: "AI creates specific, actionable improvements with revenue estimates",
      visual: "suggestions",
      duration: 3000
    },
    {
      title: "⚡ Auto-Implements Changes",
      description: "Creates GitHub PRs with optimized code ready for deployment",
      visual: "deployment",
      duration: 3000
    },
    {
      title: "📈 Tracks Results",
      description: "Monitors performance improvements and ROI in real-time",
      visual: "tracking",
      duration: 3000
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, demoSteps[currentStep].duration);

    return () => clearInterval(timer);
  }, [currentStep, isPlaying, demoSteps]);

  const renderVisual = (visual: string) => {
    const baseClasses = "w-full h-64 rounded-xl flex items-center justify-center transition-all duration-1000";
    
    switch (visual) {
      case "scanning":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30`}>
            <div className="relative">
              <Globe className="w-24 h-24 text-blue-400 animate-pulse" />
              <div className="absolute -inset-4 border-2 border-blue-400 rounded-full animate-ping opacity-30"></div>
              <div className="absolute -inset-8 border border-blue-400 rounded-full animate-spin opacity-20"></div>
            </div>
          </div>
        );
      case "analyzing":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30`}>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div 
                  key={i}
                  className="w-8 h-8 bg-green-400 rounded animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        );
      case "suggestions":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30`}>
            <div className="space-y-4 w-full max-w-md">
              {[...Array(3)].map((_, i) => (
                <div 
                  key={i}
                  className="flex items-center space-x-3 p-3 bg-yellow-400/20 rounded-lg transform transition-all duration-500"
                  style={{ 
                    transform: `translateX(${i * 10}px)`,
                    animationDelay: `${i * 0.3}s`
                  }}
                >
                  <Target className="w-6 h-6 text-yellow-400" />
                  <div className="flex-1 h-3 bg-yellow-400/40 rounded animate-pulse"></div>
                  <span className="text-yellow-400 font-bold">+${(i + 1) * 150}/mo</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "deployment":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30`}>
            <div className="relative">
              <GitPullRequest className="w-24 h-24 text-purple-400" />
              <div className="absolute -top-4 -right-4">
                <Rocket className="w-12 h-12 text-pink-400 animate-bounce" />
              </div>
              <div className="absolute -bottom-4 -left-4">
                <Check className="w-8 h-8 text-green-400 animate-pulse" />
              </div>
            </div>
          </div>
        );
      case "tracking":
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30`}>
            <div className="relative w-full max-w-md">
              <BarChart3 className="w-24 h-24 text-emerald-400 mx-auto" />
              <div className="absolute top-0 right-0">
                <TrendingUp className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
              <div className="mt-4 flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-3 bg-emerald-400 rounded-t animate-bounce"
                    style={{ 
                      height: `${(i + 1) * 8}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return <div className={baseClasses}></div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-dark-50 mb-2">
              ✨ See Nebula in Action
            </h2>
            <p className="text-text-dark-secondary">
              Watch how Nebula transforms your website automatically
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-text-dark-secondary hover:text-dark-50 transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Demo Content */}
        <div className="space-y-8">
          {/* Current Step Display */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-primary px-4 py-2 rounded-full text-white font-semibold mb-4">
              <span>Step {currentStep + 1} of {demoSteps.length}</span>
            </div>
            <h3 className="text-xl font-semibold text-dark-50 mb-2">
              {demoSteps[currentStep].title}
            </h3>
            <p className="text-text-dark-secondary max-w-2xl mx-auto">
              {demoSteps[currentStep].description}
            </p>
          </div>

          {/* Visual Demo */}
          <div className="relative">
            {renderVisual(demoSteps[currentStep].visual)}
            
            {/* Progress Bar */}
            <div className="mt-6 w-full bg-surface-dark border border-border-dark rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ 
                  width: `${((currentStep + 1) / demoSteps.length) * 100}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center space-x-2">
            {demoSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-gradient-primary scale-125' 
                    : index < currentStep
                    ? 'bg-success-dark'
                    : 'bg-border-dark hover:bg-text-dark-secondary'
                }`}
              />
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2 bg-gradient-primary text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all font-semibold"
            >
              {isPlaying ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                  </svg>
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Play</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setCurrentStep(0)}
              className="flex items-center space-x-2 border border-border-dark text-text-dark px-6 py-3 rounded-xl hover:bg-surface-dark transition-colors font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Restart</span>
            </button>
          </div>

          {/* CTA */}
          <div className="text-center pt-4 border-t border-border-dark">
            <p className="text-text-dark-secondary mb-4">
              Ready to see these results on your website?
            </p>
            <button 
              onClick={handleStartFreeTrial}
              className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 flex items-center mx-auto"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}