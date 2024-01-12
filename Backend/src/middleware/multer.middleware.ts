import multer from 'multer';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import fs from 'fs'

const storage = multer.diskStorage({
    destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        cb(null, './public/temp');
    },
    filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
        cb(null, file.originalname);
    },
});

export const upload = multer({ storage: storage });