'use client';

import React, { useState } from 'react';
import { Check, Loader2, CreditCard, Shield, ArrowRight } from 'lucide-react';

interface PricingCheckoutProps {
  planType: 'starter' | 'pro' | 'agency' | 'enterprise';
  onCheckout?: (planType: string) => void;
}

export default function PricingCheckout({ planType, onCheckout }: PricingCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    starter: {
      name: 'Starter',
      description: 'Perfect for hobby projects and early-stage startups',
      monthly: { price: 0, priceId: 'price_starter_monthly' },
      yearly: { price: 0, priceId: 'price_starter_yearly', savings: 0 },
      features: [
        '1 website',
        '50 pages crawled',
        'Weekly analysis',
        'PDF audit reports',
        'Manual PR creation',
        'Email support',
        '1 competitor tracked',
        'Basic performance monitoring',
      ],
      cta: 'Start Free',
      popular: false,
      freeTrialDays: 0,
    },
    pro: {
      name: 'Pro',
      description: 'Ideal for growing SaaS and e-commerce businesses',
      monthly: { price: 79, priceId: 'price_pro_monthly' },
      yearly: { price: 790, priceId: 'price_pro_yearly', savings: 158 }, // ~20% off
      features: [
        '5 websites',
        '10,000 pages crawled',
        'Nightly analysis',
        'Auto-merge PRs',
        'SGE answer blocks',
        'Wallet pass generator',
        '3 competitors tracked',
        'Slack integration',
        'Advanced analytics',
        'A/B testing ready',
      ],
      cta: 'Start 14-Day Trial',
      popular: true,
      freeTrialDays: 14,
    },
    agency: {
      name: 'Agency',
      description: 'Built for agencies managing multiple client sites',
      monthly: { price: 299, priceId: 'price_agency_monthly' },
      yearly: { price: 2990, priceId: 'price_agency_yearly', savings: 598 }, // ~20% off
      features: [
        '25 websites',
        '25,000 pages crawled',
        'Hourly monitoring',
        'White-label dashboard',
        'API access',
        'Custom branding',
        '5 competitors per site',
        'Priority support',
        'Advanced reporting',
        'Client management',
        'Team collaboration',
        'Custom integrations',
      ],
      cta: 'Start 14-Day Trial',
      popular: false,
      freeTrialDays: 14,
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For large organizations with complex requirements',
      monthly: { price: null, priceId: 'contact_sales' },
      yearly: { price: null, priceId: 'contact_sales', savings: null },
      features: [
        'Unlimited websites',
        'Unlimited pages',
        'Real-time monitoring',
        'SSO integration',
        'Custom AI models',
        'Dedicated support',
        'SLA guarantees',
        'On-premise option',
        'Custom training',
        'Enterprise security',
        'Advanced compliance',
        'Dedicated CSM',
      ],
      cta: 'Contact Sales',
      popular: false,
      freeTrialDays: 30,
    },
  };

  const currentPlan = plans[planType];
  const currentPrice = currentPlan[billingCycle];

  const handleCheckout = async () => {
    if (currentPrice.priceId === 'contact_sales') {
      // Redirect to contact form or calendar booking
      window.open('https://calendly.com/nebula-growth/enterprise-demo', '_blank');
      return;
    }

    if (currentPrice.price === 0) {
      // Handle free plan signup
      if (onCheckout) {
        onCheckout(planType);
      }
      return;
    }

    setIsLoading(true);

    try {
      // Create checkout session
      const response = await fetch('/.netlify/functions/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: currentPrice.priceId,
          planType,
          billingCycle,
          successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/pricing`,
        }),
      });

      const { sessionUrl, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Checkout failed:', error);
      // Show error message to user
      alert('Checkout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Custom';
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const calculateSavings = (monthly: number, yearly: number) => {
    const monthlyCost = monthly * 12;
    const savings = monthlyCost - yearly;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return { amount: savings, percentage };
  };

  return (
    <div className="bg-surface-dark rounded-2xl border border-border-dark p-8 relative overflow-hidden">
      {currentPlan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-dark-50 mb-2">{currentPlan.name}</h3>
        <p className="text-text-dark-secondary text-sm mb-6">{currentPlan.description}</p>

        {/* Billing Toggle */}
        {currentPrice.price !== null && currentPrice.price > 0 && (
          <div className="flex items-center justify-center mb-6">
            <div className="bg-dark-800 rounded-lg p-1 flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-primary-dark text-white'
                    : 'text-text-dark-secondary hover:text-dark-50'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors relative ${
                  billingCycle === 'yearly'
                    ? 'bg-primary-dark text-white'
                    : 'text-text-dark-secondary hover:text-dark-50'
                }`}
              >
                Yearly
                {currentPlan.yearly.savings && currentPlan.yearly.savings > 0 && (
                  <span className="absolute -top-2 -right-2 bg-success-dark text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Price Display */}
        <div className="mb-6">
          <div className="flex items-baseline justify-center">
            <span className="text-4xl font-bold text-dark-50">
              {formatPrice(currentPrice.price)}
            </span>
            {currentPrice.price !== null && currentPrice.price > 0 && (
              <span className="text-text-dark-secondary ml-2">
                /{billingCycle === 'yearly' ? 'year' : 'month'}
              </span>
            )}
          </div>

          {billingCycle === 'yearly' && currentPlan.yearly.savings && currentPlan.yearly.savings > 0 && (
            <div className="text-sm text-success-dark mt-2">
              Save ${currentPlan.yearly.savings}/year compared to monthly
            </div>
          )}

          {currentPlan.freeTrialDays > 0 && (
            <div className="text-sm text-primary-dark mt-2">
              {currentPlan.freeTrialDays}-day free trial • No credit card required
            </div>
          )}
        </div>
      </div>

      {/* Features List */}
      <div className="mb-8">
        <ul className="space-y-3">
          {currentPlan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-success-dark mt-0.5 flex-shrink-0" />
              <span className="text-text-dark-secondary text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA Button */}
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center ${
          currentPlan.popular
            ? 'bg-gradient-primary text-white hover:opacity-90'
            : 'border border-border-dark text-text-dark hover:bg-dark-800'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            {currentPlan.cta}
            {currentPrice.priceId !== 'contact_sales' && currentPrice.price !== null && currentPrice.price > 0 && (
              <ArrowRight className="w-5 h-5 ml-2" />
            )}
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="mt-6 flex items-center justify-center text-xs text-text-dark-secondary">
        <Shield className="w-4 h-4 mr-2 text-success-dark" />
        <span>Secure payment powered by Stripe</span>
      </div>

      {/* Additional Info */}
      <div className="mt-4 text-center">
        <div className="text-xs text-text-dark-secondary space-y-1">
          <div>✓ Cancel anytime</div>
          <div>✓ 30-day money-back guarantee</div>
          <div>✓ SOC 2 compliant & GDPR ready</div>
        </div>
      </div>
    </div>
  );
}

// Usage tracking component for Pro+ plans
export function UsageTracker({ currentUsage, limits, planType }: {
  currentUsage: {
    sites: number;
    pages: number;
    crawls: number;
  };
  limits: {
    sites: number;
    pages: number;
    crawls: number;
  };
  planType: string;
}) {
  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-error-dark';
    if (percentage >= 75) return 'text-warning-dark';
    return 'text-success-dark';
  };

  return (
    <div className="bg-surface-dark rounded-xl p-6 border border-border-dark">
      <h3 className="text-lg font-semibold text-dark-50 mb-4">Usage This Month</h3>
      
      <div className="space-y-4">
        {/* Sites Usage */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-dark-secondary">Websites</span>
            <span className={getUsageColor(getUsagePercentage(currentUsage.sites, limits.sites))}>
              {currentUsage.sites} / {limits.sites}
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all"
              style={{ width: `${getUsagePercentage(currentUsage.sites, limits.sites)}%` }}
            />
          </div>
        </div>

        {/* Pages Usage */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-dark-secondary">Pages Crawled</span>
            <span className={getUsageColor(getUsagePercentage(currentUsage.pages, limits.pages))}>
              {currentUsage.pages.toLocaleString()} / {limits.pages.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all"
              style={{ width: `${getUsagePercentage(currentUsage.pages, limits.pages)}%` }}
            />
          </div>
        </div>

        {/* Crawls Usage */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text-dark-secondary">Optimization Runs</span>
            <span className={getUsageColor(getUsagePercentage(currentUsage.crawls, limits.crawls))}>
              {currentUsage.crawls} / {limits.crawls}
            </span>
          </div>
          <div className="w-full bg-dark-700 rounded-full h-2">
            <div 
              className="bg-gradient-primary h-2 rounded-full transition-all"
              style={{ width: `${getUsagePercentage(currentUsage.crawls, limits.crawls)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Upgrade CTA if approaching limits */}
      {Object.values(currentUsage).some((usage, index) => 
        getUsagePercentage(usage, Object.values(limits)[index]) >= 80
      ) && planType !== 'ENTERPRISE' && (
        <div className="mt-6 p-4 bg-warning-dark/10 border border-warning-dark/20 rounded-lg">
          <div className="text-sm text-warning-dark mb-2">Approaching plan limits</div>
          <div className="text-xs text-text-dark-secondary mb-3">
            Upgrade to continue optimizing without interruption
          </div>
          <button className="bg-gradient-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            Upgrade Plan
          </button>
        </div>
      )}
    </div>
  );
}