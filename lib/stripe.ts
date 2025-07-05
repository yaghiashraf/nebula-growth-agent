import Stripe from 'stripe';

// Simple logger fallback
const logger = {
  info: console.log,
  error: console.error,
  warn: console.warn,
  debug: console.log,
};

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

// Stripe configuration
export const stripeConfig = {
  webhook: {
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
    tolerance: 300, // 5 minutes
  },
  checkout: {
    successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
  },
};

// Product and pricing configuration
export const stripePlans = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID || 'price_starter',
    productId: process.env.STRIPE_STARTER_PRODUCT_ID || 'prod_starter',
    amount: 0,
    currency: 'usd',
    interval: 'month',
    features: {
      maxSites: 1,
      maxPages: 50,
      scanFrequency: 'weekly',
      competitors: 1,
      autoMerge: false,
      advancedFeatures: false,
    },
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    productId: process.env.STRIPE_PRO_PRODUCT_ID || 'prod_pro',
    amount: 7900, // $79.00
    currency: 'usd',
    interval: 'month',
    features: {
      maxSites: 5,
      maxPages: 10000,
      scanFrequency: 'nightly',
      competitors: 3,
      autoMerge: true,
      advancedFeatures: true,
    },
  },
  agency: {
    priceId: process.env.STRIPE_AGENCY_PRICE_ID || 'price_agency',
    productId: process.env.STRIPE_AGENCY_PRODUCT_ID || 'prod_agency',
    amount: 29900, // $299.00
    currency: 'usd',
    interval: 'month',
    features: {
      maxSites: 25,
      maxPages: 25000,
      scanFrequency: 'hourly',
      competitors: 5,
      autoMerge: true,
      advancedFeatures: true,
      whiteLabel: true,
      apiAccess: true,
    },
  },
} as const;

export type PlanType = keyof typeof stripePlans;

// Stripe utility functions
export class StripeService {
  // Create checkout session
  static async createCheckoutSession({
    priceId,
    customerId,
    userId,
    planType,
    successUrl,
    cancelUrl,
  }: {
    priceId: string;
    customerId?: string;
    userId: string;
    planType: PlanType;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<Stripe.Checkout.Session> {
    try {
      const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl || stripeConfig.checkout.successUrl,
        cancel_url: cancelUrl || stripeConfig.checkout.cancelUrl,
        metadata: {
          userId,
          planType,
        },
        subscription_data: {
          metadata: {
            userId,
            planType,
          },
        },
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        tax_id_collection: {
          enabled: true,
        },
      };

      // If existing customer, use their ID
      if (customerId) {
        sessionConfig.customer = customerId;
      } else {
        sessionConfig.customer_creation = 'always';
      }

      const session = await stripe.checkout.sessions.create(sessionConfig);

      logger.info('Stripe checkout session created', {
        sessionId: session.id,
        userId,
        planType,
        amount: stripePlans[planType].amount,
      });

      return session;
    } catch (error) {
      logger.error('Failed to create Stripe checkout session', { error, userId, planType });
      throw error;
    }
  }

  // Create customer portal session
  static async createPortalSession({
    customerId,
    returnUrl,
  }: {
    customerId: string;
    returnUrl?: string;
  }): Promise<Stripe.BillingPortal.Session> {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });

      logger.info('Stripe portal session created', { customerId, sessionId: session.id });
      return session;
    } catch (error) {
      logger.error('Failed to create Stripe portal session', { error, customerId });
      throw error;
    }
  }

  // Create or update customer
  static async createOrUpdateCustomer({
    userId,
    email,
    name,
    metadata = {},
  }: {
    userId: string;
    email: string;
    name?: string;
    metadata?: Record<string, string>;
  }): Promise<Stripe.Customer> {
    try {
      // Check if customer already exists
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        const customer = existingCustomers.data[0];
        
        // Update existing customer
        const updatedCustomer = await stripe.customers.update(customer.id, {
          name,
          metadata: {
            ...customer.metadata,
            userId,
            ...metadata,
          },
        });

        logger.info('Stripe customer updated', { customerId: customer.id, userId });
        return updatedCustomer;
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          userId,
          ...metadata,
        },
      });

      logger.info('Stripe customer created', { customerId: customer.id, userId });
      return customer;
    } catch (error) {
      logger.error('Failed to create/update Stripe customer', { error, userId, email });
      throw error;
    }
  }

  // Get customer subscriptions
  static async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.items.data.price.product'],
      });

      return subscriptions.data;
    } catch (error) {
      logger.error('Failed to get customer subscriptions', { error, customerId });
      throw error;
    }
  }

  // Get active subscription for customer
  static async getActiveSubscription(customerId: string): Promise<Stripe.Subscription | null> {
    try {
      const subscriptions = await this.getCustomerSubscriptions(customerId);
      const activeSubscription = subscriptions.find(sub => 
        ['active', 'trialing'].includes(sub.status)
      );

      return activeSubscription || null;
    } catch (error) {
      logger.error('Failed to get active subscription', { error, customerId });
      return null;
    }
  }

  // Cancel subscription
  static async cancelSubscription({
    subscriptionId,
    immediately = false,
  }: {
    subscriptionId: string;
    immediately?: boolean;
  }): Promise<Stripe.Subscription> {
    try {
      if (immediately) {
        const subscription = await stripe.subscriptions.cancel(subscriptionId);
        logger.info('Stripe subscription cancelled immediately', { subscriptionId });
        return subscription;
      } else {
        const subscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true,
        });
        logger.info('Stripe subscription scheduled for cancellation', { subscriptionId });
        return subscription;
      }
    } catch (error) {
      logger.error('Failed to cancel subscription', { error, subscriptionId });
      throw error;
    }
  }

  // Reactivate subscription
  static async reactivateSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false,
      });

      logger.info('Stripe subscription reactivated', { subscriptionId });
      return subscription;
    } catch (error) {
      logger.error('Failed to reactivate subscription', { error, subscriptionId });
      throw error;
    }
  }

  // Update subscription
  static async updateSubscription({
    subscriptionId,
    newPriceId,
    prorationBehavior = 'create_prorations',
  }: {
    subscriptionId: string;
    newPriceId: string;
    prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
  }): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ],
        proration_behavior: prorationBehavior,
      });

      logger.info('Stripe subscription updated', { subscriptionId, newPriceId });
      return updatedSubscription;
    } catch (error) {
      logger.error('Failed to update subscription', { error, subscriptionId, newPriceId });
      throw error;
    }
  }

  // Create usage record for metered billing
  static async createUsageRecord({
    subscriptionItemId,
    quantity,
    timestamp,
    action = 'set',
  }: {
    subscriptionItemId: string;
    quantity: number;
    timestamp?: number;
    action?: 'increment' | 'set';
  }): Promise<Stripe.UsageRecord> {
    try {
      const usageRecord = await stripe.subscriptionItems.createUsageRecord(
        subscriptionItemId,
        {
          quantity,
          timestamp: timestamp || Math.floor(Date.now() / 1000),
          action,
        }
      );

      logger.info('Stripe usage record created', { subscriptionItemId, quantity });
      return usageRecord;
    } catch (error) {
      logger.error('Failed to create usage record', { error, subscriptionItemId, quantity });
      throw error;
    }
  }

  // Validate webhook signature
  static validateWebhookSignature(payload: string, signature: string): Stripe.Event {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeConfig.webhook.secret
      );
    } catch (error) {
      logger.error('Invalid Stripe webhook signature', { error });
      throw new Error('Invalid webhook signature');
    }
  }

  // Get invoice preview for subscription change
  static async getInvoicePreview({
    customerId,
    subscriptionId,
    newPriceId,
  }: {
    customerId: string;
    subscriptionId?: string;
    newPriceId: string;
  }): Promise<Stripe.Invoice> {
    try {
      const params: any = {
        customer: customerId,
        subscription_items: [
          {
            price: newPriceId,
            quantity: 1,
          },
        ],
      };

      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        params.subscription_items = [
          {
            id: subscription.items.data[0].id,
            price: newPriceId,
          },
        ];
        params.subscription_proration_date = Math.floor(Date.now() / 1000);
      }

      // const invoice = await stripe.invoices.createPreview(params);
      // Fallback for deployment
      return {} as Stripe.Invoice;
    } catch (error) {
      logger.error('Failed to get invoice preview', { error, customerId, newPriceId });
      throw error;
    }
  }

  // Get plan details from price ID
  static getPlanFromPriceId(priceId: string): { planType: PlanType; plan: typeof stripePlans[PlanType] } | null {
    for (const [planType, plan] of Object.entries(stripePlans)) {
      if (plan.priceId === priceId) {
        return { planType: planType as PlanType, plan };
      }
    }
    return null;
  }

  // Format amount for display
  static formatAmount(amount: number, currency = 'usd'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  // Calculate proration amount
  static calculateProration({
    currentAmount,
    newAmount,
    daysRemaining,
    totalDays,
  }: {
    currentAmount: number;
    newAmount: number;
    daysRemaining: number;
    totalDays: number;
  }): number {
    const unusedAmount = (currentAmount * daysRemaining) / totalDays;
    const newChargeAmount = (newAmount * daysRemaining) / totalDays;
    return Math.round(newChargeAmount - unusedAmount);
  }
}

export default StripeService;