import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const createOrder: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const trackOrder: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const getOrders: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const getOrderById: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const updateOrderLogistics: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const getMyOrders: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<Response<ApiResponse<unknown>, Record<string, any>> | undefined>;
export declare const cleanupStaleOrders: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=orders.controller.d.ts.map