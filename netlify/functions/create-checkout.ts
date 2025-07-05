import { Handler } from '@netlify/functions';
import { StripeService } from '../../lib/stripe';
import { db } from '../../lib/db';
import { logger } from '../../lib/logger';
import type { NetlifyFunctionEvent, NetlifyFunctionContext } from '../../types';

export const handler: Handler = async (event: NetlifyFunctionEvent, context: NetlifyFunctionContext) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { 
      priceId, 
      planType, 
      billingCycle = 'monthly',
      successUrl, 
      cancelUrl,
      userId,
      customerEmail,
      customerName,
    } = JSON.parse(event.body || '{}');

    if (!priceId || !planType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Handle free plan
    if (priceId === 'price_starter_monthly' || priceId === 'price_starter_yearly') {
      // For free plans, create user account directly
      if (!userId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'userId required for free plan signup' }),
        };
      }

      // Update user to starter plan
      await db.client.user.update({
        where: { id: userId },
        data: { plan: 'STARTER' },
      });

      // Track free signup
      await db.trackAnalytics('free_signup', {
        userId,
        planType: 'starter',
        source: 'checkout',
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          redirectUrl: '/dashboard?welcome=true' 
        }),
      };
    }

    // For paid plans, create Stripe checkout session
    let customerId: string | undefined;

    // Get or create Stripe customer
    if (userId) {
      // Get user from database
      const user = await db.client.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        // Create or update Stripe customer
        const customer = await StripeService.createOrUpdateCustomer({
          userId,
          email: user.email,
          name: user.name || customerName,
        });
        customerId = customer.id;
      }
    } else if (customerEmail) {
      // Create customer for guest checkout
      const customer = await StripeService.createOrUpdateCustomer({
        userId: 'guest',
        email: customerEmail,
        name: customerName,
      });
      customerId = customer.id;
    }

    // Create checkout session
    const session = await StripeService.createCheckoutSession({
      priceId,
      customerId,
      userId: userId || 'guest',
      planType,
      successUrl,
      cancelUrl,
    });

    // Track checkout initiation
    await db.trackAnalytics('checkout_initiated', {
      userId: userId || 'guest',
      planType,
      billingCycle,
      priceId,
      sessionId: session.id,
    });

    logger.info('Checkout session created successfully', {
      sessionId: session.id,
      userId,
      planType,
      priceId,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        sessionUrl: session.url,
        sessionId: session.id,
      }),
    };

  } catch (error) {
    logger.error('Failed to create checkout session', { error });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};

// Helper function to validate plan limits
function validatePlanLimits(planType: string, currentUsage: any) {
  const limits = {
    starter: { sites: 1, pages: 50, competitors: 1 },
    pro: { sites: 5, pages: 10000, competitors: 3 },
    agency: { sites: 25, pages: 25000, competitors: 5 },
    enterprise: { sites: Infinity, pages: Infinity, competitors: 10 },
  };

  const planLimits = limits[planType as keyof typeof limits];
  if (!planLimits) return false;

  return (
    currentUsage.sites <= planLimits.sites &&
    currentUsage.pages <= planLimits.pages &&
    currentUsage.competitors <= planLimits.competitors
  );
}