"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = exports.broadcastNotification = exports.subscribeToNotifications = void 0;
const supabase_1 = require("../config/supabase");
const web_push_1 = __importDefault(require("web-push"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure web-push with VAPID keys
web_push_1.default.setVapidDetails(process.env.VAPID_SUBJECT || 'mailto:support@haiflytrapng.com', process.env.VAPID_PUBLIC_KEY || '', process.env.VAPID_PRIVATE_KEY || '');
const subscribeToNotifications = async (req, res) => {
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
        const { data, error } = await supabase_1.supabaseAdmin
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
        if (error)
            throw error;
        res.status(201).json({ message: 'Subscription saved successfully', data });
    }
    catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ error: 'Failed to save subscription', details: error.message });
    }
};
exports.subscribeToNotifications = subscribeToNotifications;
const broadcastNotification = async (req, res) => {
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
        let query = supabase_1.supabaseAdmin.from('push_subscriptions').select('*');
        if (user_type) {
            query = query.eq('user_type', user_type);
        }
        const { data: subscriptions, error } = await query;
        if (error)
            throw error;
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
                await web_push_1.default.sendNotification(pushSubscription, payload);
            }
            catch (err) {
                console.error('Error sending push notification to endpoint:', sub.endpoint, err);
                // If the subscription is no longer valid (e.g., user unsubscribed), delete it
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await supabase_1.supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
                }
            }
        });
        await Promise.allSettled(sendPromises);
        res.status(200).json({ message: `Broadcasted to ${subscriptions.length} endpoints.` });
    }
    catch (error) {
        console.error('Error broadcasting notification:', error);
        res.status(500).json({ error: 'Failed to broadcast notification', details: error.message });
    }
};
exports.broadcastNotification = broadcastNotification;
// Exported utility for triggering push notifications programmatically from other controllers
const sendPushNotification = async (payloadData, targetUserType, targetEmail) => {
    try {
        const payload = JSON.stringify({
            title: payloadData.title,
            body: payloadData.body,
            icon: payloadData.icon || '/favicon.ico',
            url: payloadData.url || '/'
        });
        let query = supabase_1.supabaseAdmin.from('push_subscriptions').select('*');
        if (targetUserType) {
            query = query.eq('user_type', targetUserType);
        }
        if (targetEmail) {
            // Or instead of eq, filter where email is matched
            query = query.eq('user_email', targetEmail);
        }
        const { data: subscriptions, error } = await query;
        if (error || !subscriptions)
            return;
        const sendPromises = subscriptions.map(async (sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };
            try {
                await web_push_1.default.sendNotification(pushSubscription, payload);
            }
            catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    await supabase_1.supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
                }
            }
        });
        await Promise.allSettled(sendPromises);
    }
    catch (error) {
        console.error('Error in sendPushNotification utility:', error);
    }
};
exports.sendPushNotification = sendPushNotification;
//# sourceMappingURL=notifications.controller.js.map