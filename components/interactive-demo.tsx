'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Target, 
  GitPullRequest, 
  TrendingUp, 
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Globe,
  Bot
} from 'lucide-react';

export default function InteractiveDemo() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const demoSteps = [
    {
      id: 'crawl',
      title: 'Nightly Crawl Initiated',
      description: 'Playwright crawls your site + 3 competitors, analyzing 127 pages in 8 minutes',
      icon: Globe,
      duration: 3000,
      data: {
        pages: 127,
        competitors: 3,
        time: '8 min',
        issues: 12
      }
    },
    {
      id: 'analyze',
      title: 'AI Analysis Complete',
      description: 'Claude AI processes crawl data with RAG context, identifying revenue opportunities',
      icon: Bot,
      duration: 4000,
      data: {
        opportunities: 8,
        highPriority: 3,
        estimatedRevenue: '$2,840',
        confidence: '92%'
      }
    },
    {
      id: 'rank',
      title: 'Opportunities Ranked',
      description: 'ML models rank fixes by revenue impact and implementation difficulty',
      icon: Target,
      duration: 2000,
      data: {
        topOpportunity: 'Hero CTA optimization',
        impact: '+$890/month',
        effort: 'Low',
        confidence: '94%'
      }
    },
    {
      id: 'generate',
      title: 'Code Generated',
      description: 'Automated PR creation with A/B test ready optimizations',
      icon: GitPullRequest,
      duration: 3000,
      data: {
        filesChanged: 3,
        linesModified: 47,
        prTitle: 'Optimize hero CTA for 23% higher conversion',
        tests: 'Included'
      }
    },
    {
      id: 'deploy',
      title: 'Safely Deployed',
      description: 'Lighthouse gates passed, performance improved, revenue tracking enabled',
      icon: CheckCircle,
      duration: 2000,
      data: {
        performanceScore: '+12 points',
        clsImproved: '0.08 → 0.03',
        deployed: 'Production',
        tracking: 'Active'
      }
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (demoSteps[currentStep].duration / 100));
          
          if (newProgress >= 100) {
            if (currentStep < demoSteps.length - 1) {
              setCurrentStep(curr => curr + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          
          return newProgress;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentStep, demoSteps]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <section className="py-20 bg-dark-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Play className="w-4 h-4 mr-2" />
            Interactive Demo
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-dark-50">
            Watch Nebula <span className="text-gradient">Optimize in Real-Time</span>
          </h2>
          
          <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto">
            See exactly how our AI agent finds $2,840 in monthly revenue opportunities 
            and deploys the fixes automatically—all while you sleep.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Demo Controls & Steps */}
          <div className="space-y-6">
            {/* Control Panel */}
            <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-dark-50">Growth Automation Demo</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handlePlayPause}
                    className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-10 h-10 bg-dark-700 border border-border-dark rounded-lg flex items-center justify-center text-text-dark-secondary hover:text-dark-50 transition-colors"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-text-dark-secondary mb-2">
                  <span>Step {currentStep + 1} of {demoSteps.length}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Current Step Info */}
              <div className="bg-dark-800 rounded-xl p-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                    {React.createElement(demoSteps[currentStep].icon, { className: "w-4 h-4 text-white" })}
                  </div>
                  <h4 className="text-lg font-semibold text-dark-50">
                    {demoSteps[currentStep].title}
                  </h4>
                </div>
                <p className="text-text-dark-secondary text-sm leading-relaxed">
                  {demoSteps[currentStep].description}
                </p>
              </div>
            </div>

            {/* Step Navigation */}
            <div className="space-y-3">
              {demoSteps.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = currentStep === index;
                const isCompleted = currentStep > index || (currentStep === index && progress === 100);
                
                return (
                  <button
                    key={step.id}
                    onClick={() => handleStepClick(index)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isActive 
                        ? 'bg-primary-dark/10 border-primary-dark/30' 
                        : isCompleted 
                        ? 'bg-success-dark/10 border-success-dark/30'
                        : 'bg-dark-800 border-border-dark hover:border-primary-dark/20'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                        isActive 
                          ? 'bg-primary-dark text-white' 
                          : isCompleted
                          ? 'bg-success-dark text-white'
                          : 'bg-dark-700 text-text-dark-secondary'
                      }`}>
                        {isCompleted && currentStep !== index ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <IconComponent className="w-4 h-4" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${
                          isActive ? 'text-dark-50' : isCompleted ? 'text-success-dark' : 'text-text-dark-secondary'
                        }`}>
                          {step.title}
                        </div>
                      </div>
                      
                      {isActive && (
                        <ArrowRight className="w-4 h-4 text-primary-dark" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demo Visualization */}
          <div className="bg-surface-dark rounded-2xl p-6 border border-border-dark">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-dark-50 mb-2">
                Live Results Dashboard
              </h3>
              <p className="text-text-dark-secondary text-sm">
                Real-time view of Nebula's autonomous optimization process
              </p>
            </div>

            {/* Demo Content */}
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(demoSteps[currentStep].data).map(([key, value], index) => (
                  <div 
                    key={key}
                    className="bg-dark-800 rounded-lg p-4 transition-all duration-500"
                    style={{ 
                      opacity: progress > (index * 25) ? 1 : 0.3,
                      transform: progress > (index * 25) ? 'scale(1)' : 'scale(0.95)'
                    }}
                  >
                    <div className="text-lg font-bold text-dark-50 mb-1">
                      {value}
                    </div>
                    <div className="text-xs text-text-dark-secondary capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Visual Representation */}
              <div className="bg-dark-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-dark-50">Optimization Progress</h4>
                  <div className="text-sm text-text-dark-secondary">
                    {isPlaying ? 'Processing...' : 'Ready'}
                  </div>
                </div>

                {/* Progress Visualization */}
                <div className="space-y-3">
                  {['Site Analysis', 'Competitor Research', 'AI Recommendations', 'Code Generation', 'Deployment'].map((task, index) => {
                    const taskProgress = Math.max(0, Math.min(100, (currentStep - index) * 100 + (currentStep === index ? progress : 0)));
                    
                    return (
                      <div key={task} className="flex items-center">
                        <div className="w-32 text-sm text-text-dark-secondary mr-4">
                          {task}
                        </div>
                        <div className="flex-1 bg-dark-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              taskProgress === 100 ? 'bg-success-dark' : 'bg-gradient-primary'
                            }`}
                            style={{ width: `${taskProgress}%` }}
                          />
                        </div>
                        <div className="w-12 text-right text-sm text-text-dark-secondary ml-4">
                          {Math.round(taskProgress)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Code Preview */}
              {currentStep >= 3 && (
                <div className="bg-dark-800 rounded-xl p-4 font-mono text-xs">
                  <div className="text-success-dark mb-2">+ Hero CTA Optimization</div>
                  <div className="text-error-dark mb-2">- &lt;button&gt;Learn More&lt;/button&gt;</div>
                  <div className="text-success-dark mb-2">+ &lt;button&gt;Start Free Trial&lt;/button&gt;</div>
                  <div className="text-text-dark-secondary">// A/B test ready</div>
                </div>
              )}

              {/* Results Summary */}
              {currentStep === demoSteps.length - 1 && progress >= 50 && (
                <div className="bg-gradient-primary/10 border border-primary-dark/30 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-success-dark mb-2">
                    +$890/month
                  </div>
                  <div className="text-sm text-text-dark-secondary">
                    Estimated revenue increase from this optimization
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Demo CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-dark-50 mb-4">
            This Happens Every Night, Automatically
          </h3>
          <p className="text-text-dark-secondary mb-8 max-w-2xl mx-auto">
            No setup required. Nebula connects to your GitHub and starts optimizing immediately. 
            Join 500+ teams already automating their growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity">
              Start Your Free Trial
            </button>
            <button className="border border-border-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-dark transition-colors">
              Schedule Live Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}