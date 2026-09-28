import Stripe from 'stripe';

/**
 * PHASE 22: MONETIZATION & BILLING
 * 
 * Manages the Stripe integration to allow API Providers to sponsor their listings 
 * (boosting them in the Phase 9 OpenSearch results) or developers to upgrade
 * their rate limits for the Phase 11 REST API.
 */
export class BillingService {
  private stripe: Stripe;

  constructor(secretKey: string) {
    // Initializing Stripe with the strict API version
    this.stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
  }

  /**
   * Generates a secure Stripe Checkout URL for an API Provider 
   * wanting to sponsor their listing.
   */
  public async createSponsorshipCheckout(providerId: string, apiId: string, returnUrl: string) {
    console.log(`[Billing] 💳 Generating Sponsorship Checkout for API: ${apiId}`);
    
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sponsored API Listing',
              description: `Boost global visibility for API: ${apiId} on Mahi API Verse.`
            },
            unit_amount: 9900, // $99.00 / month
            recurring: { interval: 'month' }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // The metadata is absolutely critical. It ties the Stripe payment 
      // back to our exact PostgreSQL database records (Phase 8).
      metadata: {
        providerId,
        apiId,
        tier: 'sponsored_listing'
      },
      success_url: `${returnUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/cancel`,
    });

    return session.url;
  }

  /**
   * Secure Webhook Handler
   * Listens for Stripe events (like successful payments or cancellations)
   * and updates our PostgreSQL database accordingly.
   */
  public async handleWebhook(rawPayload: string, signature: string, endpointSecret: string) {
    try {
      // Cryptographically verify the webhook came from Stripe
      const event = this.stripe.webhooks.constructEvent(rawPayload, signature, endpointSecret);

      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const { providerId, apiId } = session.metadata || {};
          
          console.log(`[Billing] ✨ Payment successful! Provider ${providerId} sponsored API ${apiId}.`);
          
          // Next Step: We would execute a Drizzle ORM query (Phase 8) here to update the DB:
          // await db.update(apis).set({ isSponsored: true }).where(eq(apis.id, apiId));
          
          // Next Step 2: Trigger re-index in OpenSearch (Phase 9) so it appears at the top.
          break;
        }
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as Stripe.Subscription;
          console.log(`[Billing] ❌ Subscription cancelled. Demoting API.`);
          // Execute Drizzle ORM query to set `isSponsored: false`
          break;
        }
        default:
          console.log(`[Billing] Unhandled event type: ${event.type}`);
      }
      
      return { received: true };
    } catch (err: any) {
      console.error(`[Billing] 🛑 Webhook Signature Verification Failed.`, err.message);
      throw new Error("Webhook Error");
    }
  }
}
