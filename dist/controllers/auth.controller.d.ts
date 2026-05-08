import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const register: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const login: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const logout: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const adminLogin: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const handlerLogin: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const adminRegister: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const deleteAccount: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const getMe: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const syncUser: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map