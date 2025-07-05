'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Download, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  Loader2,
  DollarSign,
  TrendingUp,
  Settings
} from 'lucide-react';

interface BillingDashboardProps {
  userId: string;
}

interface Subscription {
  id: string;
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'unpaid';
  planName: string;
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created: string;
  dueDate?: string;
  pdfUrl: string;
}

interface PaymentMethod {
  id: string;
  type: 'card';
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

export default function BillingDashboard({ userId }: BillingDashboardProps) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingData();
  }, [userId]);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      
      // Fetch billing data from your API
      const [subscriptionRes, invoicesRes, paymentMethodsRes] = await Promise.all([
        fetch(`/api/billing/subscription?userId=${userId}`),
        fetch(`/api/billing/invoices?userId=${userId}`),
        fetch(`/api/billing/payment-methods?userId=${userId}`),
      ]);

      if (subscriptionRes.ok) {
        const subscriptionData = await subscriptionRes.json();
        setSubscription(subscriptionData);
      }

      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
      }

      if (paymentMethodsRes.ok) {
        const paymentMethodsData = await paymentMethodsRes.json();
        setPaymentMethods(paymentMethodsData);
      }
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      setActionLoading('portal');
      
      const response = await fetch('/.netlify/functions/customer-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const { portalUrl } = await response.json();
      window.open(portalUrl, '_blank');
    } catch (error) {
      console.error('Failed to open customer portal:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription || !confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      setActionLoading('cancel');
      
      const response = await fetch('/api/billing/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId,
          subscriptionId: subscription.id,
        }),
      });

      if (response.ok) {
        await fetchBillingData();
      }
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return <CheckCircle className="w-5 h-5 text-success-dark" />;
      case 'past_due':
      case 'unpaid':
        return <AlertTriangle className="w-5 h-5 text-warning-dark" />;
      case 'canceled':
        return <XCircle className="w-5 h-5 text-error-dark" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-text-dark-secondary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'trialing':
        return 'text-success-dark';
      case 'past_due':
      case 'unpaid':
        return 'text-warning-dark';
      case 'canceled':
        return 'text-error-dark';
      default:
        return 'text-text-dark-secondary';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-dark animate-spin mx-auto mb-4" />
          <p className="text-text-dark-secondary">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-dark-50">Billing & Subscription</h1>
          <button
            onClick={handleManageBilling}
            disabled={actionLoading === 'portal'}
            className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center"
          >
            {actionLoading === 'portal' ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Settings className="w-5 h-5 mr-2" />
            )}
            Manage Billing
          </button>
        </div>

        {/* Current Subscription */}
        <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Current Subscription</h2>
          
          {subscription ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(subscription.status)}
                  <div>
                    <h3 className="text-lg font-semibold text-dark-50">{subscription.planName}</h3>
                    <p className={`text-sm ${getStatusColor(subscription.status)}`}>
                      {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-dark-50">
                    {formatAmount(subscription.amount, subscription.currency)}
                  </div>
                  <div className="text-sm text-text-dark-secondary">
                    per {subscription.interval}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-dark-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary-dark" />
                    <span className="text-sm font-medium text-dark-50">Current Period</span>
                  </div>
                  <p className="text-text-dark-secondary text-sm">
                    {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
                  </p>
                </div>

                {subscription.trialEnd && (
                  <div className="bg-dark-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-success-dark" />
                      <span className="text-sm font-medium text-dark-50">Trial Ends</span>
                    </div>
                    <p className="text-text-dark-secondary text-sm">
                      {formatDate(subscription.trialEnd)}
                    </p>
                  </div>
                )}
              </div>

              {subscription.cancelAtPeriodEnd && (
                <div className="bg-warning-dark/10 border border-warning-dark/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-warning-dark" />
                    <span className="text-warning-dark font-medium">
                      Subscription will cancel on {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                {!subscription.cancelAtPeriodEnd && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={actionLoading === 'cancel'}
                    className="border border-error-dark text-error-dark px-4 py-2 rounded-lg hover:bg-error-dark/10 transition-colors text-sm"
                  >
                    {actionLoading === 'cancel' ? 'Canceling...' : 'Cancel Subscription'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-text-dark-secondary mb-4">No active subscription found</p>
              <a
                href="/pricing"
                className="bg-gradient-primary text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Choose a Plan
              </a>
            </div>
          )}
        </div>

        {/* Payment Methods */}
        <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Payment Methods</h2>
          
          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-dark/20 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-dark" />
                    </div>
                    <div>
                      <p className="text-dark-50 font-medium">
                        {method.card.brand.toUpperCase()} •••• {method.card.last4}
                      </p>
                      <p className="text-text-dark-secondary text-sm">
                        Expires {method.card.expMonth}/{method.card.expYear}
                      </p>
                    </div>
                  </div>
                  
                  {method.isDefault && (
                    <span className="bg-success-dark/20 text-success-dark px-2 py-1 rounded text-xs font-medium">
                      Default
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-dark-secondary">No payment methods on file</p>
          )}
        </div>

        {/* Billing History */}
        <div className="bg-surface-dark rounded-2xl p-8 border border-border-dark">
          <h2 className="text-xl font-bold text-dark-50 mb-6">Billing History</h2>
          
          {invoices.length > 0 ? (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-dark-800 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-dark/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary-dark" />
                    </div>
                    <div>
                      <p className="text-dark-50 font-medium">
                        Invoice #{invoice.number}
                      </p>
                      <p className="text-text-dark-secondary text-sm">
                        {formatDate(invoice.created)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-dark-50 font-medium">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </p>
                      <p className={`text-sm ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </p>
                    </div>
                    
                    <a
                      href={invoice.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center hover:bg-dark-600 transition-colors"
                    >
                      <Download className="w-4 h-4 text-text-dark-secondary" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-dark-secondary">No billing history available</p>
          )}
        </div>

        {/* Billing Support */}
        <div className="bg-dark-800 rounded-2xl p-6 border border-border-dark">
          <h3 className="text-lg font-semibold text-dark-50 mb-4">Need Help?</h3>
          <p className="text-text-dark-secondary mb-4">
            Have questions about your billing or need to make changes to your subscription?
          </p>
          <div className="flex space-x-4">
            <a
              href="mailto:billing@nebula-growth.com"
              className="border border-border-dark text-text-dark px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-sm"
            >
              Contact Billing Support
            </a>
            <a
              href="/help/billing"
              className="border border-border-dark text-text-dark px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors text-sm flex items-center"
            >
              Billing FAQ
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}