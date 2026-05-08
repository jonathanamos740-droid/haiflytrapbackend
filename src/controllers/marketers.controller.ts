import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiResponse } from '../types';

export const getMarketers = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { data, error } = await supabaseAdmin.from('marketers').select('*').order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createMarketer = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const marketerData = req.body;

    const { data, error } = await supabaseAdmin.from('marketers').insert([marketerData]).select().single();

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateMarketer = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabaseAdmin
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
  } catch (err) {
    next(err);
  }
};

export const deleteMarketer = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin.from('marketers').delete().eq('id', id);

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, message: 'Marketer deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const validateCoupon = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { code } = req.params;

    if (!code) {
      res.status(400).json({ success: false, error: 'Coupon code is required' });
      return;
    }

    const { data, error } = await supabaseAdmin
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
  } catch (err) {
    next(err);
  }
};
