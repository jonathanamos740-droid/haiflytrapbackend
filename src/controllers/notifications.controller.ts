import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';
import webpush from 'web-push';
import dotenv from 'dotenv';

dotenv.config();

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:support@haiflytrapng.com',
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
);

export const subscribeToNotifications = async (req: Request, res: Response) => {
  try {
    const { subscription, user_type, user_id, user_email } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription object' });
    }

    const { endpoint, keys } = subscription;
    const p256dh = keys?.p256dh;
    const auth = keys?.auth;

    if (!p256dh || !auth) {
      return res.status(400).json({ error: 'Subscription missing keys' });
    }

    // Insert or update subscription in Supabase
    const { data, error } = await supabaseAdmin
      .from('push_subscriptions')
      .upsert({
        endpoint,
        p256dh,
        auth,
        user_type: user_type || 'customer',
        user_id: user_id || null,
        user_email: user_email || null,
        created_at: new Date().toISOString()
      }, { onConflict: 'endpoint' })
      .select();

    if (error) throw error;

    res.status(201).json({ message: 'Subscription saved successfully', data });
  } catch (error: any) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ error: 'Failed to save subscription', details: error.message });
  }
};

export const broadcastNotification = async (req: Request, res: Response) => {
  try {
    const { title, body, icon, url, user_type } = req.body;

    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' });
    }

    // Build the payload
    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/favicon.ico',
      url: url || '/'
    });

    // Fetch subscriptions
    let query = supabaseAdmin.from('push_subscriptions').select('*');
    if (user_type) {
      query = query.eq('user_type', user_type);
    }

    const { data: subscriptions, error } = await query;

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(200).json({ message: 'No subscriptions found to broadcast to.' });
    }

    // Send notifications to all matching subscriptions
    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };

      try {
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        console.error('Error sending push notification to endpoint:', sub.endpoint, err);
        // If the subscription is no longer valid (e.g., user unsubscribed), delete it
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    });

    await Promise.allSettled(sendPromises);

    res.status(200).json({ message: `Broadcasted to ${subscriptions.length} endpoints.` });
  } catch (error: any) {
    console.error('Error broadcasting notification:', error);
    res.status(500).json({ error: 'Failed to broadcast notification', details: error.message });
  }
};

// Exported utility for triggering push notifications programmatically from other controllers
export const sendPushNotification = async (
  payloadData: { title: string; body: string; icon?: string; url?: string },
  targetUserType?: string,
  targetEmail?: string
) => {
  try {
    const payload = JSON.stringify({
      title: payloadData.title,
      body: payloadData.body,
      icon: payloadData.icon || '/favicon.ico',
      url: payloadData.url || '/'
    });

    let query = supabaseAdmin.from('push_subscriptions').select('*');
    if (targetUserType) {
      query = query.eq('user_type', targetUserType);
    }
    if (targetEmail) {
      // Or instead of eq, filter where email is matched
      query = query.eq('user_email', targetEmail);
    }

    const { data: subscriptions, error } = await query;
    if (error || !subscriptions) return;

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth
        }
      };
      try {
        await webpush.sendNotification(pushSubscription, payload);
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    });

    await Promise.allSettled(sendPromises);
  } catch (error) {
    console.error('Error in sendPushNotification utility:', error);
  }
};
