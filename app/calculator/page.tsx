'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function CalculatorPage() {
  const [inputs, setInputs] = useState({
    monthlyRevenue: '',
    conversionRate: '',
    averageOrderValue: '',
    monthlyVisitors: '',
    timeSpentOptimizing: ''
  });
  const [results, setResults] = useState<any>(null);

  const calculateGrowthTax = () => {
    const revenue = parseFloat(inputs.monthlyRevenue) || 0;
    const conversion = parseFloat(inputs.conversionRate) || 0;
    const aov = parseFloat(inputs.averageOrderValue) || 0;
    const visitors = parseFloat(inputs.monthlyVisitors) || 0;
    const timeSpent = parseFloat(inputs.timeSpentOptimizing) || 0;

    // Calculate potential improvements
    const potentialConversionIncrease = 0.25; // 25% average increase
    const currentOrders = (visitors * conversion) / 100;
    const improvedOrders = (visitors * (conversion * (1 + potentialConversionIncrease))) / 100;
    const additionalRevenue = (improvedOrders - currentOrders) * aov;
    
    // Calculate time cost
    const hourlyRate = 75; // Average growth marketer rate
    const timeCostMonthly = timeSpent * 4 * hourlyRate; // 4 weeks per month
    const timeCostAnnual = timeCostMonthly * 12;

    // Calculate opportunity cost
    const missedRevenueMonthly = additionalRevenue;
    const missedRevenueAnnual = missedRevenueMonthly * 12;

    const totalGrowthTax = timeCostAnnual + missedRevenueAnnual;

    setResults({
      currentRevenue: revenue,
      potentialRevenue: revenue + additionalRevenue,
      additionalRevenue,
      timeCostMonthly,
      timeCostAnnual,
      missedRevenueMonthly,
      missedRevenueAnnual,
      totalGrowthTax,
      conversionImprovement: conversion * potentialConversionIncrease
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Calculator className="w-4 h-4 mr-2" />
              Growth Tax Calculator
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
              Calculate Your <span className="text-gradient">Growth Tax</span>
            </h1>
            
            <p className="text-xl text-text-dark-secondary max-w-3xl mx-auto">
              Discover how much manual optimization is costing your business in lost revenue 
              and wasted time. Get your personalized growth tax report in 60 seconds.
            </p>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Input Form */}
              <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
                <h2 className="text-2xl font-bold text-dark-50 mb-6">Your Business Metrics</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Monthly Revenue ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.monthlyRevenue}
                      onChange={(e) => setInputs({...inputs, monthlyRevenue: e.target.value})}
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="50000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Current Conversion Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.conversionRate}
                      onChange={(e) => setInputs({...inputs, conversionRate: e.target.value})}
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="2.5"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Average Order Value ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.averageOrderValue}
                      onChange={(e) => setInputs({...inputs, averageOrderValue: e.target.value})}
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="125"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Monthly Website Visitors
                    </label>
                    <input
                      type="number"
                      value={inputs.monthlyVisitors}
                      onChange={(e) => setInputs({...inputs, monthlyVisitors: e.target.value})}
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="10000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark-50 mb-2">
                      Hours/Week Spent on Manual Optimization
                    </label>
                    <input
                      type="number"
                      value={inputs.timeSpentOptimizing}
                      onChange={(e) => setInputs({...inputs, timeSpentOptimizing: e.target.value})}
                      className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                      placeholder="8"
                    />
                  </div>

                  <button
                    onClick={calculateGrowthTax}
                    className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    Calculate My Growth Tax
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {results ? (
                  <>
                    <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
                      <h3 className="text-xl font-bold text-dark-50 mb-6">Your Growth Tax Report</h3>
                      
                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="bg-dark-800 rounded-xl p-4">
                          <div className="flex items-center mb-2">
                            <DollarSign className="w-5 h-5 text-error-dark mr-2" />
                            <span className="text-sm text-text-dark-secondary">Annual Growth Tax</span>
                          </div>
                          <div className="text-2xl font-bold text-error-dark">
                            {formatCurrency(results.totalGrowthTax)}
                          </div>
                        </div>

                        <div className="bg-dark-800 rounded-xl p-4">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="w-5 h-5 text-success-dark mr-2" />
                            <span className="text-sm text-text-dark-secondary">Potential Monthly Gain</span>
                          </div>
                          <div className="text-2xl font-bold text-success-dark">
                            {formatCurrency(results.additionalRevenue)}
                          </div>
                        </div>
                      </div>

                      {/* Breakdown */}
                      <div className="space-y-4">
                        <div className="border-t border-border-dark pt-4">
                          <h4 className="font-semibold text-dark-50 mb-3">Cost Breakdown</h4>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-text-dark-secondary">Time Cost (Annual)</span>
                              <span className="text-error-dark font-medium">
                                {formatCurrency(results.timeCostAnnual)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-text-dark-secondary">Missed Revenue (Annual)</span>
                              <span className="text-error-dark font-medium">
                                {formatCurrency(results.missedRevenueAnnual)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-border-dark pt-2">
                              <span className="font-medium text-dark-50">Total Growth Tax</span>
                              <span className="text-error-dark font-bold text-lg">
                                {formatCurrency(results.totalGrowthTax)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-border-dark pt-4">
                          <h4 className="font-semibold text-dark-50 mb-3">With Nebula Optimization</h4>
                          
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-text-dark-secondary">Current Conversion Rate</span>
                              <span className="text-dark-50">{inputs.conversionRate}%</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-text-dark-secondary">Optimized Conversion Rate</span>
                              <span className="text-success-dark font-medium">
                                {(parseFloat(inputs.conversionRate || '0') * 1.25).toFixed(1)}%
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                              <span className="text-text-dark-secondary">Additional Monthly Revenue</span>
                              <span className="text-success-dark font-medium">
                                {formatCurrency(results.additionalRevenue)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-gradient-primary/10 border border-primary-dark/30 rounded-xl p-6">
                      <h3 className="font-bold text-dark-50 mb-2">Ready to Eliminate Your Growth Tax?</h3>
                      <p className="text-text-dark-secondary text-sm mb-4">
                        See how Nebula can automate your optimization and recover this lost revenue.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button 
                          onClick={() => window.location.href = '/signup'}
                          className="bg-gradient-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                        >
                          Start Free Trial
                        </button>
                        <button 
                          onClick={() => window.location.href = '/demo'}
                          className="border border-border-dark text-text-dark px-6 py-2 rounded-lg font-medium hover:bg-surface-dark transition-colors"
                        >
                          Schedule Demo
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
                    <div className="text-center">
                      <Calculator className="w-16 h-16 text-primary-dark mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-dark-50 mb-2">Ready to Calculate?</h3>
                      <p className="text-text-dark-secondary">
                        Fill in your business metrics to see how much manual optimization is costing you.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}