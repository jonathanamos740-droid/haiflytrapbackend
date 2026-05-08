"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getBlogs = void 0;
const supabase_1 = require("../config/supabase");
const getBlogs = async (req, res, next) => {
    try {
        const { data, error } = await supabase_1.supabaseAnon.from('blogs').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error('Supabase Error (getBlogs):', error);
            res.status(500).json({ success: false, error: error.message });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        console.error('Internal Error (getBlogs):', err);
        next(err);
    }
};
exports.getBlogs = getBlogs;
const getBlogById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase_1.supabaseAnon.from('blogs').select('*').eq('id', id).single();
        if (error) {
            res.status(404).json({ success: false, error: 'Blog post not found' });
            return;
        }
        res.status(200).json({ success: true, data });
    }
    catch (err) {
        next(err);
    }
};
exports.getBlogById = getBlogById;
const createBlog = async (req, res, next) => {
    try {
        const blogData = req.body;
        const { data, error } = await supabase_1.supabaseAdmin.from('blogs').insert([blogData]).select().single();
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
exports.createBlog = createBlog;
const updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        // update updated_at timestamp
        updates.updated_at = new Date().toISOString();
        const { data, error } = await supabase_1.supabaseAdmin.from('blogs').update(updates).eq('id', id).select().single();
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
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error: deleteError } = await supabase_1.supabaseAdmin.from('blogs').delete().eq('id', id);
        if (deleteError) {
            res.status(400).json({ success: false, error: deleteError.message });
            return;
        }
        res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blogs.controller.js.map