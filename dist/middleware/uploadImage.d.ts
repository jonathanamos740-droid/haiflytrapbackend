import multer from 'multer';
/**
 * Multer upload instance — stores file in memory buffer.
 * Use `upload.single('image')` in routes.
 */
export declare const upload: multer.Multer;
/**
 * Upload a buffer to Cloudinary and return the URL + public_id.
 */
export declare function uploadToCloudinary(fileBuffer: Buffer, folder?: string): Promise<{
    url: string;
    publicId: string;
}>;
/**
 * Delete an image from Cloudinary by its public_id.
 */
export declare function deleteFromCloudinary(publicId: string): Promise<void>;
//# sourceMappingURL=uploadImage.d.ts.map