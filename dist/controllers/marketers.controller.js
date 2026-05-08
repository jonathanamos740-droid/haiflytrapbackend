"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCoupon = exports.deleteMarketer = exports.updateMarketer = exports.createMarketer = exports.getMarketers = void 0;
const supabase_1 = require("../config/supabase");
const getMarketers = async (req, res, next) => {
    try {
        const { data, error } = await supabase_1.supabaseAdmin.from('marketers').select('*').order('created_at', { ascending: false });
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
exports.getMarketers = getMarketers;
const createMarketer = async (req, res, next) => {
    try {
        const marketerData = req.body;
        const { data, error } = await supabase_1.supabaseAdmin.from('marketers').insert([marketerData]).select().single();
        if (error) {
            res.status(400).json({ success: false, error: error.message });
            return;
        }
        res.status(201).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.createMarketer = createMarketer;
const updateMarketer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase_1.supabaseAdmin
            .from('marketers')
            .update(updates)
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
exports.updateMarketer = updateMarketer;
const deleteMarketer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = await supabase_1.supabaseAdmin.from('marketers').delete().eq('id', id);
        if (error) {
            res.status(400).json({ success: false, error: error.message });
            return;
        }
        res.status(200).json({ success: true, message: 'Marketer deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteMarketer = deleteMarketer;
const validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.params;
        if (!code) {
            res.status(400).json({ success: false, error: 'Coupon code is required' });
            return;
        }
        const { data, error } = await supabase_1.supabaseAdmin
            .from('marketers')
            .select('name, commission, status')
            .ilike('code', code) // Case-insensitive matching
            .single();
        if (error || !data || data.status !== 'active') {
            res.status(404).json({ success: false, error: 'Invalid or inactive coupon code' });
            return;
        }
        // Assuming commission rate acts as the discount percentage, or define custom logic
        res.status(200).json({
            success: true,
            data: {
                valid: true,
                code: code.toUpperCase(),
                marketerName: data.name,
                discountPercent: data.commission, // e.g. 10%
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.validateCoupon = validateCoupon;
//# sourceMappingURL=marketers.controller.js.map