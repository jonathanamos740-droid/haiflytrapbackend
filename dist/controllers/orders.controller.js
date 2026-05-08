"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupStaleOrders = exports.getMyOrders = exports.updateOrderLogistics = exports.updateOrderStatus = exports.getOrderById = exports.getOrders = exports.trackOrder = exports.createOrder = void 0;
const supabase_1 = require("../config/supabase");
const email_1 = require("../config/email");
const notifications_controller_1 = require("./notifications.controller");
const createOrder = async (req, res, next) => {
    try {
        const orderData = req.body;
        // ── Server-side validation: block incomplete/premature orders ──────────────
        const requiredFields = [
            ['items', 'Order must contain at least one item'],
            ['customerName', 'Customer name is required'],
            ['customerPhone', 'Phone number is required'],
            ['customerEmail', 'Email address is required'],
            ['address', 'Delivery address is required'],
            ['city', 'City is required'],
            ['state', 'State is required'],
            ['paymentMethod', 'Payment method is required'],
        ];
        for (const [field, message] of requiredFields) {
            const value = orderData[field];
            if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && !value.trim())) {
                res.status(400).json({ success: false, error: message });
                return;
            }
        }
        // Validate totals are positive numbers
        if (typeof orderData.total !== 'number' || orderData.total <= 0) {
            res.status(400).json({ success: false, error: 'Order total must be a positive number' });
            return;
        }
        // Backend coupon validation would ideally happen here to re-calculate discount
        // For now, we trust the incoming order data or we'll fetch coupon details
        let calculatedDiscount = 0;
        if (orderData.couponCode) {
            const { data: marketer } = await supabase_1.supabaseAdmin
                .from('marketers')
                .select('commission, status')
                .ilike('code', orderData.couponCode)
                .single();
            if (marketer && marketer.status === 'active') {
                // Apply discount logic based on commission or fixed amount. 
                // This should match frontend logic. Assuming 5% or similar if needed.
                // For now, we use the frontend's discount value if passed, or recalculate.
                // In a real strict backend, you MUST recalculate subtotal, tax, shipping, discount here.
            }
        }
        // Assign tracking number
        const trackingNumber = `HT-${new Date().getFullYear()}${String(Math.random()).slice(2, 6)}-${String(Math.random()).slice(2, 6)}`;
        // Build DB payload using ONLY snake_case column names that exist in Supabase
        const newOrder = {
            customer_name: orderData.customerName,
            customer_phone: orderData.customerPhone,
            alt_phone: orderData.altPhone ?? null,
            whatsapp: orderData.whatsapp ?? null,
            customer_email: orderData.customerEmail,
            address: orderData.address,
            city: orderData.city,
            state: orderData.state,
            landmark: orderData.landmark ?? null,
            notes: orderData.notes ?? null,
            items: orderData.items,
            subtotal: orderData.subtotal,
            tax: orderData.tax,
            shipping: orderData.shipping,
            discount: orderData.discount ?? 0,
            total: orderData.total,
            payment_method: orderData.paymentMethod,
            coupon_code: orderData.couponCode ?? null,
            tracking_number: trackingNumber,
            status: orderData.paymentMethod?.toLowerCase().includes('bank') ? 'pending-payment' : 'pending',
        };
        const { data, error } = await supabase_1.supabaseAdmin.from('orders').insert([newOrder]).select().single();
        if (error) {
            res.status(400).json({ success: false, error: error.message });
            return;
        }
        // Send Confirmation Email
        (0, email_1.sendEmail)({
            to: data.customer_email,
            subject: `Order Confirmed - ${data.tracking_number}`,
            html: `
        <div style="font-family: sans-serif; color: #1a2f23; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
          <div style="background: #1a2f23; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Confirmed!</h1>
          </div>
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.5;">Hi ${data.customer_name},</p>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for your order. We're currently processing it and will let you know once it's on its way.</p>
            
            <div style="background: #f8f9fa; padding: 24px; border-radius: 16px; margin: 32px 0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Tracking Number</p>
              <p style="margin: 0 0 16px 0; font-family: monospace; font-size: 18px; font-bold; color: #1a2f23;">${data.tracking_number}</p>
              
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Total Amount</p>
              <p style="margin: 0; font-size: 18px; font-bold; color: #1a2f23;">₦${data.total.toLocaleString()}</p>
            </div>

            <p style="font-size: 14px; color: #64748b;">You can track your order status anytime on our website using your tracking number.</p>
            
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
            
            <p style="font-size: 14px; line-height: 1.5; color: #1a2f23;">
              Stay safe,<br />
              <strong>The Haifly Trap Team</strong>
            </p>
          </div>
        </div>
      `
        }).catch(console.error);
        // Send Admin Alert Email
        const adminEmail = 'amosjonathan310@gmail.com'; // TODO: change to haiflytrap@gmail.com later
        (0, email_1.sendEmail)({
            to: adminEmail,
            subject: `🚨 New Order Alert - ${data.tracking_number}`,
            html: `
        <div style="font-family: sans-serif; color: #1a2f23; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
          <div style="background: #d4a017; padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Order Received!</h1>
          </div>
          <div style="padding: 40px 20px;">
            <p style="font-size: 16px; line-height: 1.5;"><strong>Customer:</strong> ${data.customer_name}</p>
            <p style="font-size: 16px; line-height: 1.5;"><strong>Phone:</strong> ${data.customer_phone}</p>
            <p style="font-size: 16px; line-height: 1.5;"><strong>Location:</strong> ${data.address}, ${data.city}, ${data.state}</p>
            <p style="font-size: 16px; line-height: 1.5;"><strong>Payment Method:</strong> ${data.payment_method}</p>
            
            <div style="background: #f8f9fa; padding: 24px; border-radius: 16px; margin: 32px 0;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase;">Total Amount</p>
              <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1a2f23;">₦${data.total.toLocaleString()}</p>
            </div>

            <p style="font-size: 14px; color: #64748b;">Please check the Admin Dashboard for full details and to process this order.</p>
          </div>
        </div>
      `
        }).catch(console.error);
        res.status(201).json({ success: true, data });
        // Send Push Notification to admin
        (0, notifications_controller_1.sendPushNotification)({
            title: 'New Order Received! 🚨',
            body: `Order ${data.tracking_number} for ₦${data.total.toLocaleString()} from ${data.customer_name}`,
            url: '/admin'
        }, 'admin').catch(console.error);
    }
    catch (err) {
        next(err);
    }
};
exports.createOrder = createOrder;
const trackOrder = async (req, res, next) => {
    try {
        const { trackingNumber } = req.params;
        const { data, error } = await supabase_1.supabaseAdmin
            .from('orders')
            .select('*')
            .eq('tracking_number', trackingNumber)
            .single();
        if (error || !data) {
            res.status(404).json({ success: false, error: 'Order not found' });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.trackOrder = trackOrder;
const getOrders = async (req, res, next) => {
    try {
        const { data, error } = await supabase_1.supabaseAdmin
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            res.status(500).json({ success: false, error: error.message });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase_1.supabaseAdmin.from('orders').select('*').eq('id', id).single();
        if (error) {
            res.status(404).json({ success: false, error: 'Order not found' });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            res.status(400).json({ success: false, error: 'Status is required' });
            return;
        }
        // Role check: Admin or Handler
        const role = req.user?.role;
        if (role !== 'admin' && role !== 'handler') {
            res.status(403).json({ success: false, error: 'Unauthorized to update order status' });
            return;
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            res.status(400).json({ success: false, error: error.message });
            return;
        }
        // Send Delivery Email if status is delivered
        if (status === 'delivered') {
            (0, email_1.sendEmail)({
                to: data.customerEmail,
                subject: `Your Order has been Delivered! - ${data.tracking_number}`,
                html: `
          <div style="font-family: sans-serif; color: #1a2f23; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden;">
            <div style="background: #0d9488; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Order Delivered!</h1>
            </div>
            <div style="padding: 40px 20px;">
              <p style="font-size: 16px; line-height: 1.5;">Hi ${data.customerName},</p>
              <p style="font-size: 16px; line-height: 1.5;">Great news! Your order <strong>${data.tracking_number}</strong> has been successfully delivered.</p>
              
              <div style="background: #f0fdfa; border: 1px solid #ccfbf1; padding: 24px; border-radius: 16px; margin: 32px 0; text-align: center;">
                <p style="margin: 0; color: #0d9488; font-size: 16px; font-weight: bold;">Enjoy your purchase!</p>
              </div>

              <p style="font-size: 14px; color: #64748b;">If you have any questions about your order or need assistance, please don't hesitate to contact our support team.</p>
              
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 32px 0;" />
              
              <p style="font-size: 14px; line-height: 1.5; color: #1a2f23;">
                Thank you for choosing Haifly Trap,<br />
                <strong>The Haifly Trap Team</strong>
              </p>
            </div>
          </div>
        `
            }).catch(console.error);
        }
        res.status(200).json({ success: true, data });
        // Notify admins that order was updated
        (0, notifications_controller_1.sendPushNotification)({
            title: 'Order Status Updated',
            body: `Order ${data.tracking_number} is now ${status}`,
            url: '/admin'
        }, 'admin').catch(console.error);
    }
    catch (err) {
        next(err);
    }
};
exports.updateOrderStatus = updateOrderStatus;
const updateOrderLogistics = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { riderName, riderPhone } = req.body;
        // Role check: Admin or Handler
        const role = req.user?.role;
        if (role !== 'admin' && role !== 'handler') {
            res.status(403).json({ success: false, error: 'Unauthorized to update order logistics' });
            return;
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from('orders')
            .update({
            rider_name: riderName,
            rider_phone: riderPhone
        })
            .eq('id', id)
            .select()
            .single();
        if (error) {
            res.status(400).json({ success: false, error: error.message });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.updateOrderLogistics = updateOrderLogistics;
const getMyOrders = async (req, res, next) => {
    try {
        const userEmail = req.user?.email;
        if (!userEmail) {
            res.status(401).json({ success: false, error: 'Authentication required: User email not found in session.' });
            return;
        }
        // Try standard query
        const { data, error } = await supabase_1.supabaseAdmin
            .from('orders')
            .select('*')
            .eq('customer_email', userEmail.toLowerCase().trim())
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Database error in getMyOrders:', error);
            return res.status(500).json({
                success: false,
                error: `Database query failed: [${error.code}] ${error.message}. Table: orders, Column: customer_email, Value: ${userEmail}`
            });
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        console.error('Unexpected error in getMyOrders:', err);
        res.status(500).json({ success: false, error: 'An unexpected server error occurred.' });
    }
};
exports.getMyOrders = getMyOrders;
const cleanupStaleOrders = async (req, res, next) => {
    try {
        // Delete orders older than 30 minutes that are still pending with no customer details
        const cutoffTime = new Date(Date.now() - 30 * 60 * 1000).toISOString();
        const { data, error } = await supabase_1.supabaseAdmin
            .from('orders')
            .delete()
            .in('status', ['pending', 'pending-payment'])
            .lt('created_at', cutoffTime)
            .or('customer_name.is.null,customer_phone.is.null,address.is.null,customer_phone.eq.')
            .select();
        if (error) {
            res.status(500).json({ success: false, error: error.message });
            return;
        }
        res.status(200).json({
            success: true,
            data: { deletedCount: data?.length ?? 0, message: `Cleaned up ${data?.length ?? 0} stale orders` }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.cleanupStaleOrders = cleanupStaleOrders;
//# sourceMappingURL=orders.controller.js.map