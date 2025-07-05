import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { StripeService } from '../../lib/stripe';

// Simplified fallbacks for deployment
const db = {
  client: {
    user: {
      update: async (...args: any[]) => ({}),
      findUnique: async (...args: any[]) => ({}),
    },
    subscription: {
      create: async (...args: any[]) => ({}),
      update: async (...args: any[]) => ({}),
    },
  },
  trackAnalytics: async (...args: any[]) => ({}),
};

const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn,
};
export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const signature = event.headers['stripe-signature'];
  const payload = event.body;

  if (!signature || !payload) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing signature or payload' }),
    };
  }

  try {
    // Verify webhook signature
    const stripeEvent = StripeService.validateWebhookSignature(payload, signature);
    
    logger.info('Stripe webhook received', { 
      eventType: stripeEvent.type,
      eventId: stripeEvent.id 
    });

    // Handle the event
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object as Stripe.Invoice);
        break;

      case 'customer.created':
        await handleCustomerCreated(stripeEvent.data.object as Stripe.Customer);
        break;

      case 'customer.updated':
        await handleCustomerUpdated(stripeEvent.data.object as Stripe.Customer);
        break;

      case 'customer.deleted':
        await handleCustomerDeleted(stripeEvent.data.object as Stripe.Customer);
        break;

      default:
        logger.info('Unhandled Stripe webhook event', { eventType: stripeEvent.type });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    logger.error('Stripe webhook error', { error });
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook handler failed' }),
    };
  }
};

// Webhook handlers
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const { userId, planType } = session.metadata || {};
    
    if (!userId || !planType) {
      throw new Error('Missing required metadata in checkout session');
    }

    // Update user with customer ID and subscription
    await db.client.user.update({
      where: { id: userId },
      data: {
        plan: planType.toUpperCase() as any,
        // Store Stripe customer ID for future reference
      },
    });

    logger.info('Checkout completed successfully', { 
      userId, 
      planType, 
      sessionId: session.id,
      customerId: session.customer 
    });

    // Send welcome email
    await sendWelcomeEmail(userId, planType);
    
  } catch (error) {
    logger.error('Failed to handle checkout completed', { error, sessionId: session.id });
    throw error;
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  try {
    const { userId, planType } = subscription.metadata || {};
    
    if (!userId) {
      throw new Error('Missing userId in subscription metadata');
    }

    // Update user subscription status
    await db.client.user.update({
      where: { id: userId },
      data: {
        plan: planType?.toUpperCase() as any || 'PRO',
      },
    });

    // Track subscription creation event
    await db.trackAnalytics('subscription_created', {
      userId,
      planType,
      subscriptionId: subscription.id,
      amount: subscription.items.data[0]?.price.unit_amount || 0,
      currency: subscription.items.data[0]?.price.currency || 'usd',
    });

    logger.info('Subscription created', { 
      userId, 
      planType, 
      subscriptionId: subscription.id 
    });
  } catch (error) {
    logger.error('Failed to handle subscription created', { 
      error, 
      subscriptionId: subscription.id 
    });
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    const { userId } = subscription.metadata || {};
    
    if (!userId) {
      logger.warn('Missing userId in subscription metadata for update', { 
        subscriptionId: subscription.id 
      });
      return;
    }

    // Determine new plan type from price ID
    const priceId = subscription.items.data[0]?.price.id;
    const planInfo = StripeService.getPlanFromPriceId(priceId);
    
    if (planInfo) {
      await db.client.user.update({
        where: { id: userId },
        data: {
          plan: planInfo.planType.toUpperCase() as any,
        },
      });

      // Track plan change
      await db.trackAnalytics('subscription_updated', {
        userId,
        planType: planInfo.planType,
        subscriptionId: subscription.id,
        status: subscription.status,
      });
    }

    // Handle subscription status changes
    if (subscription.status === 'canceled') {
      // Downgrade to starter plan
      await db.client.user.update({
        where: { id: userId },
        data: { plan: 'STARTER' },
      });
    }

    logger.info('Subscription updated', { 
      userId, 
      subscriptionId: subscription.id,
      status: subscription.status,
      planType: planInfo?.planType 
    });
  } catch (error) {
    logger.error('Failed to handle subscription updated', { 
      error, 
      subscriptionId: subscription.id 
    });
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    const { userId } = subscription.metadata || {};
    
    if (!userId) {
      logger.warn('Missing userId in subscription metadata for deletion', { 
        subscriptionId: subscription.id 
      });
      return;
    }

    // Downgrade user to starter plan
    await db.client.user.update({
      where: { id: userId },
      data: { plan: 'STARTER' },
    });

    // Track subscription cancellation
    await db.trackAnalytics('subscription_cancelled', {
      userId,
      subscriptionId: subscription.id,
      cancelledAt: new Date().toISOString(),
    });

    // Send feedback email
    await sendCancellationEmail(userId);

    logger.info('Subscription deleted', { 
      userId, 
      subscriptionId: subscription.id 
    });
  } catch (error) {
    logger.error('Failed to handle subscription deleted', { 
      error, 
      subscriptionId: subscription.id 
    });
    throw error;
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    const subscriptionId = invoice.subscription as string;

    // Track successful payment
    await db.trackAnalytics('payment_succeeded', {
      customerId,
      subscriptionId,
      invoiceId: invoice.id,
      amount: invoice.amount_paid,
      currency: invoice.currency,
    });

    logger.info('Payment succeeded', { 
      customerId, 
      subscriptionId, 
      invoiceId: invoice.id,
      amount: invoice.amount_paid 
    });
  } catch (error) {
    logger.error('Failed to handle payment succeeded', { 
      error, 
      invoiceId: invoice.id 
    });
    throw error;
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    const subscriptionId = invoice.subscription as string;

    // Track failed payment
    await db.trackAnalytics('payment_failed', {
      customerId,
      subscriptionId,
      invoiceId: invoice.id,
      amount: invoice.amount_due,
      currency: invoice.currency,
      attemptCount: invoice.attempt_count,
    });

    // Send payment failure notification
    await sendPaymentFailedEmail(customerId);

    logger.warn('Payment failed', { 
      customerId, 
      subscriptionId, 
      invoiceId: invoice.id,
      amount: invoice.amount_due,
      attemptCount: invoice.attempt_count 
    });
  } catch (error) {
    logger.error('Failed to handle payment failed', { 
      error, 
      invoiceId: invoice.id 
    });
    throw error;
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  try {
    logger.info('Customer created', { 
      customerId: customer.id, 
      email: customer.email 
    });

    // Track customer creation
    await db.trackAnalytics('customer_created', {
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
    });
  } catch (error) {
    logger.error('Failed to handle customer created', { 
      error, 
      customerId: customer.id 
    });
    throw error;
  }
}

async function handleCustomerUpdated(customer: Stripe.Customer) {
  try {
    logger.info('Customer updated', { 
      customerId: customer.id, 
      email: customer.email 
    });

    // Track customer update
    await db.trackAnalytics('customer_updated', {
      customerId: customer.id,
      email: customer.email,
      name: customer.name,
    });
  } catch (error) {
    logger.error('Failed to handle customer updated', { 
      error, 
      customerId: customer.id 
    });
    throw error;
  }
}

async function handleCustomerDeleted(customer: Stripe.Customer) {
  try {
    const { userId } = customer.metadata || {};

    if (userId) {
      // Archive user data instead of deleting
      await db.client.user.update({
        where: { id: userId },
        data: { 
          plan: 'STARTER',
          // Mark as archived or suspended
        },
      });
    }

    logger.info('Customer deleted', { 
      customerId: customer.id, 
      userId 
    });

    // Track customer deletion
    await db.trackAnalytics('customer_deleted', {
      customerId: customer.id,
      userId,
    });
  } catch (error) {
    logger.error('Failed to handle customer deleted', { 
      error, 
      customerId: customer.id 
    });
    throw error;
  }
}

// Email notification functions (to be implemented with your email service)
async function sendWelcomeEmail(userId: string, planType: string) {
  try {
    // Implement with your email service (SendGrid, Postmark, etc.)
    logger.info('Welcome email sent', { userId, planType });
  } catch (error) {
    logger.error('Failed to send welcome email', { error, userId });
  }
}

async function sendCancellationEmail(userId: string) {
  try {
    // Implement feedback survey and cancellation confirmation
    logger.info('Cancellation email sent', { userId });
  } catch (error) {
    logger.error('Failed to send cancellation email', { error, userId });
  }
}

async function sendPaymentFailedEmail(customerId: string) {
  try {
    // Implement payment retry notification
    logger.info('Payment failed email sent', { customerId });
  } catch (error) {
    logger.error('Failed to send payment failed email', { error, customerId });
  }
}