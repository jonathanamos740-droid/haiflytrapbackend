import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiResponse, Product } from '../types';
import { deleteFromCloudinary } from '../middleware/uploadImage';

export const getProducts = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { category } = req.query;

    let query = supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });

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
  } catch (err) {
    console.error('Internal Error (getProducts):', err);
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin.from('products').select('*').eq('id', id).single();

    if (error) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const productData = req.body;

    const { data, error } = await supabaseAdmin.from('products').insert([productData]).select().single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabaseAdmin.from('products').update(updates).eq('id', id).select().single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Get the product first to find its image
    const { data: product, error: fetchError } = await supabaseAdmin.from('products').select('*').eq('id', id).single();

    if (fetchError || !product) {
      res.status(404).json({ success: false, error: 'Product not found' });
      return;
    }

    // Delete image from Cloudinary if it exists
    if (product.cloudinary_public_id) {
      await deleteFromCloudinary(product.cloudinary_public_id);
    }

    // Delete product from DB
    const { error: deleteError } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (deleteError) {
      res.status(400).json({ success: false, error: deleteError.message });
      return;
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
