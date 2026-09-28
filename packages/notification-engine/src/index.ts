import nodemailer from 'nodemailer';

// Stub for Discord since Discord requires specific setups and this is just the engine layer.
// We can use a simple Webhook via fetch for Discord/Slack too if we want to minimize dependencies,
// but since we are demonstrating multi-channel, we'll implement simple wrapper methods.

export interface NotificationPayload {
  title: string;
  message: string;
  level: 'info' | 'warning' | 'critical';
  context?: Record<string, any>;
}

export class NotificationEngine {
  
  /**
   * Dispatches a notification to a specific Discord webhook URL
   */
  public static async sendDiscord(webhookUrl: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const color = payload.level === 'critical' ? 16711680 : payload.level === 'warning' ? 16776960 : 65280;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          embeds: [{
            title: payload.title,
            description: payload.message,
            color,
            fields: payload.context ? Object.entries(payload.context).map(([k, v]) => ({ name: k, value: String(v) })) : []
          }]
        })
      });
      return response.ok;
    } catch (err) {
      console.error('[NotificationEngine] Discord delivery failed', err);
      return false;
    }
  }

  /**
   * Dispatches a notification to a Slack webhook URL
   */
  public static async sendSlack(webhookUrl: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `*${payload.title}*\n${payload.message}`,
        })
      });
      return response.ok;
    } catch (err) {
      console.error('[NotificationEngine] Slack delivery failed', err);
      return false;
    }
  }

  /**
   * Dispatches an email using SMTP (nodemailer)
   */
  public static async sendEmail(to: string, payload: NotificationPayload): Promise<boolean> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false, 
        auth: {
          user: process.env.SMTP_USER || 'user',
          pass: process.env.SMTP_PASS || 'pass',
        },
      });

      await transporter.sendMail({
        from: '"Mahi API Verse" <no-reply@mahiapiverse.com>',
        to,
        subject: `[${payload.level.toUpperCase()}] ${payload.title}`,
        text: `${payload.message}\n\nContext: ${JSON.stringify(payload.context, null, 2)}`,
        html: `<h2>${payload.title}</h2><p>${payload.message}</p><pre>${JSON.stringify(payload.context, null, 2)}</pre>`
      });
      return true;
    } catch (err) {
      console.error('[NotificationEngine] Email delivery failed', err);
      return false;
    }
  }
}
