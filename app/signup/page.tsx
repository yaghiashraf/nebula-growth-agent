'use client';

import React, { useState } from 'react';
import { Check, Zap, Shield, ArrowRight } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      // In a real app, this would call your signup API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard on success
      window.location.href = '/dashboard';
    } catch (error) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      <div className="pt-20 pb-20">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Start Your Free Trial
            </div>
            
            <h1 className="text-3xl font-bold mb-4 text-dark-50">
              Create Your Account
            </h1>
            
            <p className="text-text-dark-secondary">
              Join 500+ teams already automating their growth with Nebula
            </p>
          </div>

          <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-dark-50 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-dark-50 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  placeholder="At least 8 characters"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-50 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              {error && (
                <div className="text-error-dark text-sm bg-error-dark/10 border border-error-dark/20 rounded-lg p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border-dark">
              <div className="flex items-center justify-center text-xs text-text-dark-secondary">
                <Shield className="w-4 h-4 mr-2 text-success-dark" />
                SOC 2 compliant • GDPR ready • 256-bit encryption
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="text-sm font-medium text-dark-50 mb-3">What you get:</div>
              {[
                '14-day free trial with full access',
                'No credit card required to start',
                'Cancel anytime during trial',
                'Setup in less than 5 minutes'
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-text-dark-secondary">
                  <Check className="w-4 h-4 text-success-dark mr-3 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-text-dark-secondary">
              Already have an account?{' '}
              <a href="/login" className="text-primary-dark hover:text-primary-light">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}