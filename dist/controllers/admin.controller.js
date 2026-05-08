"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.deleteImage = exports.uploadImage = void 0;
const supabase_1 = require("../config/supabase");
const uploadImage_1 = require("../middleware/uploadImage");
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, error: 'No image file provided' });
            return;
        }
        // Upload buffer directly to Cloudinary
        const result = await (0, uploadImage_1.uploadToCloudinary)(req.file.buffer, 'haify-trap-products');
        res.status(200).json({
            success: true,
            data: {
                url: result.url,
                publicId: result.publicId,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (req, res, next) => {
    try {
        const { publicId } = req.body; // or req.params depending on route design
        if (!publicId) {
            res.status(400).json({ success: false, error: 'publicId is required' });
            return;
        }
        await (0, uploadImage_1.deleteFromCloudinary)(publicId);
        res.status(200).json({ success: true, message: 'Image deleted from Cloudinary' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteImage = deleteImage;
const getDashboardStats = async (req, res, next) => {
    try {
        // Basic stats aggregation (in production, use SQL functions or grouped queries)
        const [ordersRes, productsRes, marketersRes] = await Promise.all([
            supabase_1.supabaseAdmin.from('orders').select('id', { count: 'exact' }),
            supabase_1.supabaseAdmin.from('products').select('id', { count: 'exact' }),
            supabase_1.supabaseAdmin.from('marketers').select('id', { count: 'exact' }),
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalOrders: ordersRes.count || 0,
                totalProducts: productsRes.count || 0,
                totalMarketers: marketersRes.count || 0,
            },
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getDashboardStats = getDashboardStats;
//# sourceMappingURL=admin.controller.js.map