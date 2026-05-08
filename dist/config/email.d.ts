export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare const sendEmail: (options: EmailOptions) => Promise<{
    success: boolean;
    data: import("resend").CreateEmailResponse;
    error?: undefined;
} | {
    success: boolean;
    error: unknown;
    data?: undefined;
}>;
//# sourceMappingURL=email.d.ts.map