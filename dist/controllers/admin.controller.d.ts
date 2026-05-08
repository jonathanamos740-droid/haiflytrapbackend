import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const uploadImage: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const deleteImage: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const getDashboardStats: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map