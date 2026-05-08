import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, supabaseAnon } from '../config/supabase';
import { ApiResponse } from '../types';

export const getBlogs = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { data, error } = await supabaseAnon.from('blogs').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase Error (getBlogs):', error);
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Internal Error (getBlogs):', err);
    next(err);
  }
};

export const getBlogById = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAnon.from('blogs').select('*').eq('id', id).single();

    if (error) {
      res.status(404).json({ success: false, error: 'Blog post not found' });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createBlog = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const blogData = req.body;

    const { data, error } = await supabaseAdmin.from('blogs').insert([blogData]).select().single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateBlog = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // update updated_at timestamp
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin.from('blogs').update(updates).eq('id', id).select().single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteBlog = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { error: deleteError } = await supabaseAdmin.from('blogs').delete().eq('id', id);

    if (deleteError) {
      res.status(400).json({ success: false, error: deleteError.message });
      return;
    }

    res.status(200).json({ success: true, message: 'Blog post deleted successfully' });
  } catch (err) {
    next(err);
  }
};
