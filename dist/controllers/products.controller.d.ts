import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const getProducts: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const getProductById: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const createProduct: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const deleteProduct: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=products.controller.d.ts.map