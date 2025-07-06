'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Dashboard from '../../components/dashboard';
import Header from '../../components/header';
import Footer from '../../components/footer';

function DashboardContent() {
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get('welcome') === 'true';
  const plan = searchParams.get('plan');
  const sessionId = searchParams.get('session_id');

  return (
    <>
      {isWelcome && (
        <div className="pt-20 pb-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-gradient-primary/10 border border-primary-dark/30 rounded-xl p-6 text-center">
              <h2 className="text-2xl font-bold text-dark-50 mb-2">
                🎉 Welcome to Nebula Growth Agent!
              </h2>
              <p className="text-text-dark-secondary mb-4">
                {plan === 'starter' 
                  ? "You're all set with the free Starter plan. Connect your GitHub repository to begin automated optimization."
                  : sessionId 
                    ? "Thank you for your subscription! Your account is now active and ready to optimize your website."
                    : "Your account has been created successfully. Let's get started with automated growth optimization."
                }
              </p>
              {plan && (
                <div className="inline-block bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                  {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Active
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Dashboard siteId="demo-site" />
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      <Suspense fallback={
        <div className="pt-20 flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-primary-dark border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <DashboardContent />
      </Suspense>
      
      <Footer />
    </div>
  );
}