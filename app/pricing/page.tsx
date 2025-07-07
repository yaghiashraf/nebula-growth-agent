'use client';

import React, { useState } from 'react';
import { Check, Star, Zap, Shield, Users, Globe, HelpCircle } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import PricingCheckout from '../../components/pricing-checkout';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for hobby projects and early-stage startups',
      monthly: { price: 0, priceId: 'price_starter_monthly' },
      yearly: { price: 0, priceId: 'price_starter_yearly' },
      features: [
        '1 website',
        '50 pages crawled monthly',
        'Weekly optimization analysis',
        'PDF audit reports',
        'Manual PR creation',
        'Email support',
        '1 competitor tracked',
        'Basic performance monitoring',
      ],
      cta: 'Start Free Forever',
      popular: false,
      freeTrialDays: 0,
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Ideal for growing SaaS and e-commerce businesses',
      monthly: { price: 79, priceId: 'price_pro_monthly' },
      yearly: { price: 790, priceId: 'price_pro_yearly' }, // ~20% off
      features: [
        '5 websites',
        '10,000 pages crawled monthly',
        'Nightly optimization analysis',
        'Automated PR creation & merging',
        'SGE answer block generation',
        'Apple/Google Wallet passes',
        '3 competitors tracked per site',
        'Slack & email notifications',
        'Advanced analytics dashboard',
        'A/B testing recommendations',
        'Priority support',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: true,
      freeTrialDays: 14,
    },
    {
      id: 'agency',
      name: 'Agency',
      description: 'Built for agencies managing multiple client sites',
      monthly: { price: 299, priceId: 'price_agency_monthly' },
      yearly: { price: 2990, priceId: 'price_agency_yearly' }, // ~20% off
      features: [
        '25 client websites',
        '25,000 pages crawled monthly',
        'Hourly optimization monitoring',
        'White-label dashboard & reports',
        'Full API access & webhooks',
        'Custom branding & domain',
        '5 competitors tracked per site',
        'Team collaboration tools',
        'Advanced client reporting',
        'Revenue attribution tracking',
        'Dedicated account manager',
        'Phone & chat support',
      ],
      cta: 'Start 14-Day Free Trial',
      popular: false,
      freeTrialDays: 14,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with complex requirements',
      monthly: { price: null, priceId: 'contact_sales' },
      yearly: { price: null, priceId: 'contact_sales' },
      features: [
        'Unlimited websites & pages',
        'Real-time optimization monitoring',
        'Custom AI model training',
        'SSO & enterprise authentication',
        'On-premise deployment option',
        'Dedicated infrastructure',
        'Advanced security & compliance',
        '99.99% uptime SLA',
        'Custom integrations',
        'White-glove onboarding',
        '24/7 dedicated support',
        'Success manager included',
      ],
      cta: 'Contact Sales',
      popular: false,
      freeTrialDays: 30,
    },
  ];

  const faqs = [
    {
      question: 'How does the free trial work?',
      answer: 'All paid plans include a 14-day free trial with full access to all features. No credit card required to start. You can cancel anytime during the trial with no charges.',
    },
    {
      question: 'Can I change plans anytime?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged prorated for the remainder of your billing cycle. Downgrades take effect at the end of your current billing period.',
    },
    {
      question: 'What happens if I exceed my plan limits?',
      answer: 'We\'ll notify you when you approach your limits. For page crawling limits, optimization will pause until the next billing cycle or you can upgrade. We never surprise you with overage charges.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We\'re SOC 2 Type II certified and GDPR compliant. All data is encrypted in transit and at rest. We only access your data to provide optimization recommendations and never share it with third parties.',
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied for any reason, contact us within 30 days of your first payment for a full refund.',
    },
    {
      question: 'How does competitor tracking work?',
      answer: 'We crawl your competitors\' public websites to identify pricing changes, feature updates, and content improvements. This helps our AI recommend counter-strategies to keep you competitive.',
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period, and you won\'t be charged again.',
    },
    {
      question: 'Do you offer custom enterprise solutions?',
      answer: 'Yes! Our Enterprise plan includes custom AI model training, on-premise deployment, and dedicated infrastructure. Contact our sales team to discuss your specific requirements.',
    },
  ];

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Custom';
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const calculateYearlySavings = (monthly: number | null, yearly: number | null) => {
    if (!monthly || !yearly || monthly === 0 || yearly === 0) return 0;
    const monthlyCost = monthly * 12;
    return Math.round(((monthlyCost - yearly) / monthlyCost) * 100);
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Simple, Transparent Pricing
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
              Stop Losing Money to <span className="text-gradient">Hidden Revenue Leaks</span>
            </h1>
            
            <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto mb-8">
              Every day you wait, competitors pull ahead and revenue leaks get worse. 
              <strong className="text-dark-50">Join 500+ teams</strong> who've recovered millions in lost revenue.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <div className="bg-dark-800 rounded-lg p-1 flex">
                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-6 py-3 rounded text-sm font-medium transition-colors ${
                    billingCycle === 'monthly'
                      ? 'bg-primary-dark text-white'
                      : 'text-text-dark-secondary hover:text-dark-50'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-6 py-3 rounded text-sm font-medium transition-colors relative ${
                    billingCycle === 'yearly'
                      ? 'bg-primary-dark text-white'
                      : 'text-text-dark-secondary hover:text-dark-50'
                  }`}
                >
                  Yearly
                  <span className="absolute -top-2 -right-2 bg-success-dark text-white text-xs px-2 py-1 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-text-dark-secondary">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-success-dark mr-2" />
                SOC 2 Certified
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 text-success-dark mr-2" />
                500+ Teams Trust Us
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-warning-dark mr-2" />
                4.9/5 Customer Rating
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {plans.map((plan) => {
                const currentPrice = plan[billingCycle];
                const savings = calculateYearlySavings(plan.monthly.price, plan.yearly.price);
                
                return (
                  <div key={plan.id} className={`relative bg-surface-dark rounded-2xl border transition-all hover:transform hover:scale-105 ${
                    plan.popular ? 'border-primary-dark ring-2 ring-primary-dark ring-opacity-50' : 'border-border-dark'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <div className="p-8">
                      {/* Plan Header */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-dark-50 mb-2">{plan.name}</h3>
                        <p className="text-text-dark-secondary text-sm mb-6">{plan.description}</p>
                        
                        <div className="mb-4">
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

                          {billingCycle === 'yearly' && savings > 0 && (
                            <div className="text-sm text-success-dark mt-2">
                              Save {savings}% with yearly billing
                            </div>
                          )}

                          {plan.freeTrialDays > 0 && (
                            <div className="text-sm text-primary-dark mt-2">
                              {plan.freeTrialDays}-day free trial
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-3">
                            <Check className="w-5 h-5 text-success-dark mt-0.5 flex-shrink-0" />
                            <span className="text-text-dark-secondary text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA */}
                      <PricingCheckout planType={plan.id as any} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-surface-dark">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark-50">
                Feature Comparison
              </h2>
              <p className="text-xl text-text-dark-secondary">
                See exactly what's included in each plan
              </p>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-dark">
                    <th className="text-left py-4 px-6 text-dark-50 font-semibold">Feature</th>
                    <th className="text-center py-4 px-6 text-dark-50 font-semibold">Starter</th>
                    <th className="text-center py-4 px-6 text-dark-50 font-semibold">Pro</th>
                    <th className="text-center py-4 px-6 text-dark-50 font-semibold">Agency</th>
                    <th className="text-center py-4 px-6 text-dark-50 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Websites', '1', '5', '25', 'Unlimited'],
                    ['Pages per month', '50', '10,000', '25,000', 'Unlimited'],
                    ['Optimization frequency', 'Weekly', 'Nightly', 'Hourly', 'Real-time'],
                    ['Competitors tracked', '1', '3', '5', '10'],
                    ['Auto-merge PRs', '❌', '✅', '✅', '✅'],
                    ['White-label', '❌', '❌', '✅', '✅'],
                    ['API access', '❌', 'Basic', 'Full', 'Full'],
                    ['SSO integration', '❌', '❌', '❌', '✅'],
                    ['SLA guarantee', '❌', '❌', '99.9%', '99.99%'],
                    ['Support', 'Email', 'Priority', 'Phone', '24/7 Dedicated'],
                  ].map(([feature, starter, pro, agency, enterprise], index) => (
                    <tr key={index} className="border-b border-border-dark/50">
                      <td className="py-4 px-6 text-text-dark-secondary">{feature}</td>
                      <td className="py-4 px-6 text-center text-text-dark-secondary">{starter}</td>
                      <td className="py-4 px-6 text-center text-text-dark-secondary">{pro}</td>
                      <td className="py-4 px-6 text-center text-text-dark-secondary">{agency}</td>
                      <td className="py-4 px-6 text-center text-text-dark-secondary">{enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-dark-50">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-text-dark-secondary">
                Everything you need to know about our pricing and plans
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-surface-dark rounded-xl border border-border-dark">
                  <button
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between hover:bg-dark-800/50 transition-colors"
                  >
                    <span className="text-dark-50 font-medium">{faq.question}</span>
                    <HelpCircle className={`w-5 h-5 text-primary-dark transition-transform ${
                      faqOpen === index ? 'rotate-180' : ''
                    }`} />
                  </button>
                  
                  {faqOpen === index && (
                    <div className="px-6 pb-6">
                      <p className="text-text-dark-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-dark-50">
              How Much Revenue Will You <span className="text-gradient">Lose Tomorrow</span>?
            </h2>
            <p className="text-xl text-text-dark-secondary mb-8 max-w-2xl mx-auto">
              Every day costs you $200-500 in hidden revenue leaks. <strong className="text-dark-50">500+ teams</strong> have already stopped the bleeding and recovered <strong className="text-success-dark">$2.1M+ total</strong>. 
              Your turn.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/signup"
                className="bg-gradient-primary text-white px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Stop the Revenue Bleeding
              </a>
              <a
                href="/demo"
                className="border border-border-dark text-text-dark px-8 py-4 rounded-xl text-lg font-semibold hover:bg-surface-dark transition-colors"
              >
                See $12k Recovery Demo
              </a>
            </div>
            
            <div className="text-center text-sm text-text-dark-secondary mt-6">
              ⚡ Setup takes 5 minutes • Find issues in first 24 hours • <strong>Guarantee:</strong> Find $1k+ issues or your money back
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}