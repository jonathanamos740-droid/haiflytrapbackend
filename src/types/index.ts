// ─────────────────────────────────────────────────────────────────────────────
// Shared Types — mirrors the frontend src/types/index.ts exactly,
// with additional backend-specific types appended at the bottom.
// ─────────────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  priceLabel?: string;
  originalPriceLabel?: string;
  image: string;
  images?: string[];
  cloudinaryPublicId?: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: 'bestseller' | 'new' | 'eco-friendly' | 'sale';
  inStock: boolean;
  isLimited?: boolean;
  manualOutOfStock?: boolean;
  features?: string[];
  specifications?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  altPhone?: string;
  whatsapp?: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'pending-payment' | 'processing' | 'packed' | 'in-transit' | 'delivered';
  paymentMethod: string;
  createdAt: string;
  trackingNumber?: string;
  couponCode?: string;
  riderName?: string;
  riderPhone?: string;
}

export interface Review {
  id: string;
  customerName: string;
  initials: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Marketer {
  id: string;
  name: string;
  phone: string;
  couponCode: string;
  commission: number;
  totalSales: number;
  conversions: number;
  status: 'active' | 'inactive';
}

export interface AdminMarketer {
  id: string;
  name: string;
  initials: string;
  phone: string;
  code: string;
  commission: number;
  sales: number;
  total: number;
  earned: number;
  status: 'active' | 'inactive';
}

export interface HandlerProfile {
  id: string;
  name: string;
  initials: string;
  phone: string;
  zone: string;
  assignedOrders: number;
  completedToday: number;
  status: 'active' | 'inactive';
}

export interface HandlerOrder {
  id: string;
  orderId: string;
  customerName: string;
  location: string;
  items: number;
  total: number;
  status: 'pending' | 'packed' | 'in-transit' | 'delivered';
  products: {
    name: string;
    quantity: number;
    price: number;
    icon: string;
  }[];
  shippingMethod: string;
  riderName?: string;
  riderPhone?: string;
}

// ─── Backend-specific types ──────────────────────────────────────────────────

/** Standard API response envelope */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Paginated response */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Coupon validation result */
export interface CouponValidation {
  valid: boolean;
  code: string;
  marketerName?: string;
  discountPercent?: number;
}

/** Image upload result */
export interface ImageUploadResult {
  url: string;
  publicId: string;
}

/** Authenticated user on request */
export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  userMetadata?: Record<string, unknown>;
}

/** Extend Express Request */
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
