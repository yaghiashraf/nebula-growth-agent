'use client';

import React, { useState } from 'react';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // In a real app, this would call your authentication API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard on success
      window.location.href = '/dashboard';
    } catch (error) {
      setError('Invalid email or password. Please try again.');
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
            <h1 className="text-3xl font-bold mb-4 text-dark-50">
              Welcome Back
            </h1>
            
            <p className="text-text-dark-secondary">
              Sign in to your Nebula Growth Agent dashboard
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
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-dark-800 border border-border-dark rounded-xl px-4 py-3 pr-12 text-dark-50 placeholder-text-dark-secondary focus:outline-none focus:ring-2 focus:ring-primary-dark"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-dark-secondary hover:text-dark-50"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-primary-dark bg-dark-800 border-border-dark rounded focus:ring-primary-dark focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-text-dark-secondary">
                    Remember me
                  </span>
                </label>

                <a 
                  href="/forgot-password" 
                  className="text-sm text-primary-dark hover:text-primary-light"
                >
                  Forgot password?
                </a>
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
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border-dark">
              <div className="flex items-center justify-center text-xs text-text-dark-secondary">
                <Shield className="w-4 h-4 mr-2 text-success-dark" />
                Your data is protected with 256-bit encryption
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-text-dark-secondary">
              Don't have an account?{' '}
              <a href="/signup" className="text-primary-dark hover:text-primary-light">
                Start your free trial
              </a>
            </p>
          </div>

          {/* Demo Account Info */}
          <div className="mt-8 bg-dark-800/50 rounded-xl p-4 border border-border-dark">
            <h3 className="text-sm font-medium text-dark-50 mb-2">Demo Account</h3>
            <p className="text-xs text-text-dark-secondary mb-3">
              Try Nebula with our demo account (no signup required):
            </p>
            <div className="space-y-1 text-xs text-text-dark-secondary">
              <div>Email: demo@nebula-growth.com</div>
              <div>Password: DemoAccount123</div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}