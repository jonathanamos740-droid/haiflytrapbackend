import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { ApiResponse } from '../types';

export const getHandlers = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { data, error } = await supabaseAdmin.from('handlers').select('*').order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const createHandler = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const handlerData = req.body;
    
    // We auto-provision a Supabase Auth account using phone
    const dummyEmail = `${handlerData.phone}@handler.haifly.com`;
    const password = handlerData.phone;

    // 1. Create Auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: dummyEmail,
      password: password,
      email_confirm: true,
      user_metadata: { role: 'handler' }
    });

    if (authError) {
      res.status(400).json({ success: false, error: `Auth Error: ${authError.message}` });
      return;
    }

    // 2. Insert into handlers table
    const { data, error } = await supabaseAdmin.from('handlers').insert([handlerData]).select().single();

    if (error) {
      // Rollback auth user creation if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

export const updateHandler = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabaseAdmin
      .from('handlers')
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

export const deleteHandler = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params;

    // 1. Get handler info to get the phone number (to find the auth user)
    const { data: handler, error: fetchError } = await supabaseAdmin
      .from('handlers')
      .select('phone')
      .eq('id', id)
      .single();

    if (fetchError || !handler) {
      res.status(404).json({ success: false, error: 'Handler not found' });
      return;
    }

    // 2. Delete from handlers table
    const { error: deleteError } = await supabaseAdmin.from('handlers').delete().eq('id', id);

    if (deleteError) {
      res.status(400).json({ success: false, error: deleteError.message });
      return;
    }

    // 3. Delete from Supabase Auth (best effort)
    try {
      const dummyEmail = `${handler.phone}@handler.haifly.com`;
      // Find user by email
      const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (!listError) {
        const user = users.users.find(u => u.email === dummyEmail);
        if (user) {
          await supabaseAdmin.auth.admin.deleteUser(user.id);
        }
      }
    } catch (authErr) {
      console.error('Failed to delete auth user for handler:', authErr);
      // We don't fail the whole request if auth deletion fails
    }

    res.status(200).json({ success: true, message: 'Handler and associated account deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getHandlerOrders = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { id } = req.params; // handler ID

    // In a real DB, you'd have an assigned_handler_id on the orders table
    // or an intermediate table. For now, we simulate fetching orders assigned to this handler.
    const { data, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('assigned_handler_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
