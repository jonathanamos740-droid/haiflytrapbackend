import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
/**
 * Global error handler — catches all unhandled errors.
 * Returns a consistent ApiResponse shape.
 */
export declare function errorHandler(err: Error, _req: Request, res: Response<ApiResponse>, _next: NextFunction): void;
//# sourceMappingURL=errorHandler.d.ts.map