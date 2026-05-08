# Haifly Trap API

Production-ready Node.js + TypeScript backend for the Haifly Trap e-commerce platform.

## Features
- **Supabase (PostgreSQL)** for database and JWT Authentication
- **Cloudinary** for image hosting (direct upload via Multer, stored in memory)
- **Express.js** API with strict TypeScript typing
- **cPanel Passenger** ready (`.htaccess` and `start` scripts configured)

---

## Environment Setup

Create a `.env` file in the root of the server directory:

```env
PORT=3001
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

FRONTEND_URL=https://your-app.vercel.app
```

---

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (uses `ts-node-dev` for hot reloading):
   ```bash
   npm run dev
   ```

3. Health check:
   ```bash
   curl http://localhost:3001/api/v1/health
   ```

---

## Building for Production

Compile TypeScript to JavaScript in the `dist/` folder:

```bash
npm run build
```

---

## cPanel Deployment Guide (Shared Hosting)

1. **Create Node.js App in cPanel:**
   - Go to **Setup Node.js App** in cPanel.
   - Click **Create Application**.
   - Select Node.js version (18.x or 20.x recommended).
   - Application Mode: `Production`.
   - Application root: `haifly-trap-api`.
   - Application URL: Choose your domain or subdomain (e.g., `api.yourdomain.com`).
   - Application startup file: `dist/server.js`.
   - Click **Create**.

2. **Upload Files:**
   - Compress the `dist` folder, `package.json`, `.env`, and `.htaccess`.
   - Upload and extract them into the `haifly-trap-api` folder via File Manager.

3. **Install Production Dependencies:**
   - In the cPanel **Setup Node.js App** interface, scroll down to the "Run NPM Install" button and click it.

4. **Restart App:**
   - Click **Restart Application** in the cPanel interface.

---

## Database Schema (Supabase SQL)

Run this SQL in your Supabase SQL Editor to create the required tables:

```sql
-- 1. Users Table
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  email text,
  role text DEFAULT 'customer'::text,
  full_name text,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- 2. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  price_label TEXT,
  original_price_label TEXT,
  image TEXT,
  images TEXT[],
  cloudinary_public_id TEXT,
  category TEXT NOT NULL,
  rating NUMERIC DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  badge TEXT CHECK (badge IN ('bestseller', 'new', 'eco-friendly', 'sale')),
  in_stock BOOLEAN DEFAULT TRUE,
  is_limited BOOLEAN DEFAULT FALSE,
  manual_out_of_stock BOOLEAN DEFAULT FALSE,
  features TEXT[],
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  alt_phone TEXT,
  whatsapp TEXT,
  customer_email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  landmark TEXT,
  notes TEXT,
  items JSONB NOT NULL, -- Storing CartItems as JSON for flexibility
  subtotal NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  shipping NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT NOT NULL,
  tracking_number TEXT UNIQUE NOT NULL,
  coupon_code TEXT,
  assigned_handler_id UUID, -- References handlers
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Marketers Table
CREATE TABLE marketers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT,
  phone TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  commission NUMERIC NOT NULL,
  sales INTEGER DEFAULT 0,
  total NUMERIC DEFAULT 0,
  earned NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Handlers Table
CREATE TABLE handlers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT,
  phone TEXT NOT NULL,
  zone TEXT NOT NULL,
  assigned_orders INTEGER DEFAULT 0,
  completed_today INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for Admin overrides
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketers ENABLE ROW LEVEL SECURITY;
ALTER TABLE handlers ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Service role has full access" ON public.users USING (true) WITH CHECK (true);

-- Allow public read access to active products
CREATE POLICY "Public profiles are viewable by everyone" ON products FOR SELECT USING (manual_out_of_stock = FALSE);

-- Note: The backend uses the service_role key to bypass RLS for admin operations.
```
