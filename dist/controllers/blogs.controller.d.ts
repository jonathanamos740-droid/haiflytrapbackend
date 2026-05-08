import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const getBlogs: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const getBlogById: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const createBlog: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const updateBlog: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const deleteBlog: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
//# sourceMappingURL=blogs.controller.d.ts.map