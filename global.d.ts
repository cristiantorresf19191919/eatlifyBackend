declare module "multer-storage-cloudinary";
declare module "socket.io";
declare module "mongoose";

declare namespace Express {
    export interface Request {
        user?: {
            admin?: boolean;
            id?: string;
            name?: string;
            superuser?: boolean;
        }
    }
}