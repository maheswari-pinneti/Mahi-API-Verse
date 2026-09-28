import crypto from 'crypto';

export interface WebhookPayload {
  event: string;
  data: any;
  timestamp: string;
}

export interface WebhookConfig {
  endpointUrl: string;
  secret: string;
}

export class WebhookDispatcher {
  /**
   * Generates a cryptographic signature (HMAC SHA-256) for the given payload.
   */
  public static signPayload(payload: string, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    return `v1=${hmac.digest('hex')}`;
  }

  /**
   * Dispatches the webhook to the destination.
   * Note: In a production scenario, this relies on a robust retry mechanism (like BullMQ).
   */
  public static async dispatch(config: WebhookConfig, event: string, data: any): Promise<boolean> {
    const payload: WebhookPayload = {
      event,
      data,
      timestamp: new Date().toISOString()
    };
    
    const payloadStr = JSON.stringify(payload);
    const signature = this.signPayload(payloadStr, config.secret);

    try {
      const response = await fetch(config.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mahi-API-Verse-Webhook-Dispatcher/1.0',
          'Mahi-Signature': signature,
          'Mahi-Event': event,
        },
        body: payloadStr
      });

      if (!response.ok) {
        console.warn(`[WebhookDispatcher] Received non-200 response: ${response.status} from ${config.endpointUrl}`);
        return false;
      }
      return true;
    } catch (err) {
      console.error(`[WebhookDispatcher] Failed to dispatch webhook to ${config.endpointUrl}`, err);
      return false;
    }
  }
}
