import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/uploadImage';
import { ApiResponse } from '../types';

export const uploadImage = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No image file provided' });
      return;
    }

    // Upload buffer directly to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'haifly-trap-products');

    res.status(200).json({
      success: true,
      data: {
        url: result.url,
        publicId: result.publicId,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { publicId } = req.body; // or req.params depending on route design

    if (!publicId) {
      res.status(400).json({ success: false, error: 'publicId is required' });
      return;
    }

    await deleteFromCloudinary(publicId);

    res.status(200).json({ success: true, message: 'Image deleted from Cloudinary' });
  } catch (err) {
    next(err);
  }
};

export const getDashboardStats = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    // Basic stats aggregation (in production, use SQL functions or grouped queries)
    const [ordersRes, productsRes, marketersRes] = await Promise.all([
      supabaseAdmin.from('orders').select('id', { count: 'exact' }),
      supabaseAdmin.from('products').select('id', { count: 'exact' }),
      supabaseAdmin.from('marketers').select('id', { count: 'exact' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders: ordersRes.count || 0,
        totalProducts: productsRes.count || 0,
        totalMarketers: marketersRes.count || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};
