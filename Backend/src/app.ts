import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const app = express();

// define some middlewares

const allowedOrigins = [
    "http://localhost:3000",
    "https://www.findroomie.co",
    "https://findroomie.co"
]

const corsOptions = {
    origin: function (origin: any, callback: any) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            console.log("origin", origin)
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

app.use(cors(corsOptions));

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: "50mb"
}))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello, this is the home page!');
});

// declare routes and attach routers

import userRouter from './routes/user.routes';
import listingRouter from './routes/listing.routes';
import { ApiError } from './utils/ApiError';

app.use('/api/v1/users', userRouter)
app.use('/api/v1/listings', listingRouter)

app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: err.success,
        message: err.message,
        errors: err.errors,
    });
});

export { app }

