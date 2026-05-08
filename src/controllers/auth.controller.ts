import { Request, Response, NextFunction } from 'express';
import { supabaseAnon, supabaseAdmin } from '../config/supabase';
import { ApiResponse } from '../types';

export const register = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, password, full_name } = req.body;
    const role = 'customer'; // Force customer role based on your existing schema

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const { data, error } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: {
        data: {
          role, // 'customer'
          full_name,
        },
      },
    });

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    if (data.user) {
      // Sync user to the public.users table
      const { error: dbError } = await supabaseAdmin.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        role: role,
        full_name: full_name || null,
      });

      if (dbError) {
        console.error('Error syncing user to database:', dbError);
      }
    }

    res.status(201).json({ success: true, data: data.user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data: data.session });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Note: we'd ideally invalidate the specific token or log out the session, 
      // but in JWT setups, the client throws away the token. 
      // We can call signOut but we'd need the session context.
      // Since it's stateless API, the frontend removes the token.
    }

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const adminLogin = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: 'Email and password are required' });
      return;
    }

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      res.status(401).json({ success: false, error: error.message });
      return;
    }

    // Verify role is admin
    const userRole = data.user?.user_metadata?.role;
    if (userRole !== 'admin') {
      res.status(403).json({ success: false, error: 'Access denied. Admin privileges required.' });
      return;
    }

    res.status(200).json({ success: true, data: data.session });
  } catch (err) {
    next(err);
  }
};

export const handlerLogin = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      res.status(400).json({ success: false, error: 'Phone number is required' });
      return;
    }

    const dummyEmail = `${phone}@handler.haifly.com`;
    const password = phone;

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email: dummyEmail,
      password,
    });

    if (error) {
      res.status(401).json({ success: false, error: 'Invalid phone number or not registered as handler' });
      return;
    }

    // Verify role is handler
    const userRole = data.user?.user_metadata?.role;
    if (userRole !== 'handler') {
      res.status(403).json({ success: false, error: 'Access denied. Handler privileges required.' });
      return;
    }

    res.status(200).json({ success: true, data: data.session });
  } catch (err) {
    next(err);
  }
};

export const adminRegister = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const { email, password, adminSecret, full_name } = req.body;
    const role = 'admin';

    if (!email || !password || !adminSecret) {
      res.status(400).json({ success: false, error: 'Email, password, and adminSecret are required' });
      return;
    }

    const serverAdminSecret = process.env.ADMIN_CREATION_SECRET;
    if (!serverAdminSecret || adminSecret !== serverAdminSecret) {
      res.status(403).json({ success: false, error: 'Invalid admin secret' });
      return;
    }

    const { data, error } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: {
        data: {
          role, // 'admin'
          full_name,
        },
      },
    });

    if (error) {
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    if (data.user) {
      // Sync admin to the public.users table
      const { error: dbError } = await supabaseAdmin.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        role: role,
        full_name: full_name || null,
      });

      if (dbError) {
        console.error('Error syncing admin to database:', dbError);
      }
    }

    res.status(201).json({ success: true, data: data.user });
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user || !user.id) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    // Delete user from Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    if (authError) {
      res.status(400).json({ success: false, error: authError.message });
      return;
    }

    // Delete user from public.users table
    await supabaseAdmin.from('users').delete().eq('id', user.id);

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
export const syncUser = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    // Sync user to the public.users table (bypass RLS)
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        role: user.role || 'customer',
        full_name: user.userMetadata?.full_name || null,
      }, { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Supabase Sync Error:', error);
      res.status(400).json({ success: false, error: error.message });
      return;
    }

    res.status(200).json({ success: true, data: data?.[0] });
  } catch (err) {
    next(err);
  }
};
