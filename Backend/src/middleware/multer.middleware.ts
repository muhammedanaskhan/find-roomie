import multer from 'multer';
import { Request, Response, NextFunction, RequestHandler } from 'express';

const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, '/tmp/my-uploads');
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, file.originalname);
    },
});

export const upload = multer({ storage: storage });