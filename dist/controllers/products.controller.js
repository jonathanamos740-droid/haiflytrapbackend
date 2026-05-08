"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const supabase_1 = require("../config/supabase");
const uploadImage_1 = require("../middleware/uploadImage");
const getProducts = async (req, res, next) => {
    try {
        const { category } = req.query;
        let query = supabase_1.supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });
        if (category && category !== 'all' && category !== 'All') {
            query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (error) {
            console.error('Supabase Error (getProducts):', error);
            res.status(500).json({ success: false, error: error.message });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        console.error('Internal Error (getProducts):', err);
        next(err);
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase_1.supabaseAdmin.from('products').select('*').eq('id', id).single();
        if (error) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res, next) => {
    try {
        const productData = req.body;
        const { data, error } = await supabase_1.supabaseAdmin.from('products').insert([productData]).select().single();
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
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const { data, error } = await supabase_1.supabaseAdmin.from('products').update(updates).eq('id', id).select().single();
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
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Get the product first to find its image
        const { data: product, error: fetchError } = await supabase_1.supabaseAdmin.from('products').select('*').eq('id', id).single();
        if (fetchError || !product) {
            res.status(404).json({ success: false, error: 'Product not found' });
            return;
        }
        // Delete image from Cloudinary if it exists
        if (product.cloudinary_public_id) {
            await (0, uploadImage_1.deleteFromCloudinary)(product.cloudinary_public_id);
        }
        // Delete product from DB
        const { error: deleteError } = await supabase_1.supabaseAdmin.from('products').delete().eq('id', id);
        if (deleteError) {
            res.status(400).json({ success: false, error: deleteError.message });
            return;
        }
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=products.controller.js.map