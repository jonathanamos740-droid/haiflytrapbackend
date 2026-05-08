"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.uploadToCloudinary = uploadToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// ─── Multer memory storage (files stay in RAM, never touch disk) ──────────
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only JPG, PNG, and WebP images are allowed'));
    }
};
/**
 * Multer upload instance — stores file in memory buffer.
 * Use `upload.single('image')` in routes.
 */
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
});
/**
 * Upload a buffer to Cloudinary and return the URL + public_id.
 */
async function uploadToCloudinary(fileBuffer, folder = 'haifly-trap') {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder,
            resource_type: 'image',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' },
            ],
        }, (error, result) => {
            if (error)
                return reject(error);
            if (!result)
                return reject(new Error('Cloudinary upload returned no result'));
            resolve({
                url: result.secure_url,
                publicId: result.public_id,
            });
        });
        uploadStream.end(fileBuffer);
    });
}
/**
 * Delete an image from Cloudinary by its public_id.
 */
async function deleteFromCloudinary(publicId) {
    await cloudinary_1.default.uploader.destroy(publicId);
}
//# sourceMappingURL=uploadImage.js.map