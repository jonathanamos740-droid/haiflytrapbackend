"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Ensure the RESEND_API_KEY is available in the environment variables
const resend = new resend_1.Resend(process.env.RESEND_API_KEY || '');
const sendEmail = async (options) => {
    try {
        // Determine the from email to use, falling back to resend's test domain if not configured
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
        const response = await resend.emails.send({
            from: `Haify Trap <${fromEmail}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        console.log('Email sent successfully via Resend', response);
        return { success: true, data: response };
    }
    catch (error) {
        console.error('Error sending email via Resend:', error);
        return { success: false, error };
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map