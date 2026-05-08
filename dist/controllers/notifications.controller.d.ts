import { Request, Response } from 'express';
export declare const subscribeToNotifications: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const broadcastNotification: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const sendPushNotification: (payloadData: {
    title: string;
    body: string;
    icon?: string;
    url?: string;
}, targetUserType?: string, targetEmail?: string) => Promise<void>;
//# sourceMappingURL=notifications.controller.d.ts.map