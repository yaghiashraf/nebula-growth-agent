import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
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
    } = JSON.parse(event.body || '{}');

    if (!priceId || !planType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters' }),
      };
    }

    // Handle free plan (Starter)
    if (priceId === 'price_starter_monthly' || priceId === 'price_starter_yearly') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          sessionUrl: '/dashboard?welcome=true&plan=starter'
        }),
      };
    }

    // Handle contact sales (Enterprise)
    if (priceId === 'contact_sales') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          sessionUrl: 'https://calendly.com/nebula-growth/enterprise-demo'
        }),
      };
    }

    // For demo purposes, simulate Stripe checkout for paid plans
    // In production, this would create a real Stripe checkout session
    const mockSessionId = 'cs_demo_' + Math.random().toString(36).substring(2, 15);
    
    // Create a demo success URL
    const demoSuccessUrl = successUrl 
      ? successUrl.replace('{CHECKOUT_SESSION_ID}', mockSessionId)
      : `/dashboard?session_id=${mockSessionId}&plan=${planType}`;

    // For demonstration, we'll redirect to the success page immediately
    // In production, this would be the Stripe checkout URL
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        sessionUrl: demoSuccessUrl,
        sessionId: mockSessionId,
        message: 'Demo mode: Redirecting to success page'
      }),
    };

  } catch (error) {
    console.error('Checkout error:', error);
    
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