'use client';

import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      <Header />
      
      <div className="pt-20">
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-dark-50">
              Terms of Service
            </h1>
            <p className="text-xl text-text-dark-secondary mb-8">
              Terms and conditions for using our service
            </p>
            <div className="prose prose-invert max-w-none">
              <p>This is a placeholder for the terms of service content.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}