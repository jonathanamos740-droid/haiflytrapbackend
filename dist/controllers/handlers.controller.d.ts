import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const getHandlers: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const createHandler: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const updateHandler: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const deleteHandler: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const getHandlerOrders: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=handlers.controller.d.ts.map