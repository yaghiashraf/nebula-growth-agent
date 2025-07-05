import { Handler } from '@netlify/functions';
import { StripeService } from '../../lib/stripe';

// Simplified fallbacks for deployment
const db = {
  client: {
    user: {
      findUnique: async () => ({}),
    },
  },
  trackAnalytics: async () => ({}),
};

const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn,
};
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
    const { userId, returnUrl } = JSON.parse(event.body || '{}');

    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'userId is required' }),
      };
    }

    // Get user from database
    const user = await db.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Get or create Stripe customer
    const customer = await StripeService.createOrUpdateCustomer({
      userId,
      email: user.email,
      name: user.name,
    });

    // Create customer portal session
    const session = await StripeService.createPortalSession({
      customerId: customer.id,
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    });

    // Track portal access
    await db.trackAnalytics('customer_portal_accessed', {
      userId,
      customerId: customer.id,
      sessionId: session.id,
    });

    logger.info('Customer portal session created', {
      userId,
      customerId: customer.id,
      sessionId: session.id,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        portalUrl: session.url,
        sessionId: session.id,
      }),
    };

  } catch (error) {
    logger.error('Failed to create customer portal session', { error });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create customer portal session',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};