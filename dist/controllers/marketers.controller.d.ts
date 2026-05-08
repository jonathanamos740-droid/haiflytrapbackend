import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const getMarketers: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const createMarketer: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const updateMarketer: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const deleteMarketer: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const validateCoupon: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=marketers.controller.d.ts.map