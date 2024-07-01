import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// define some middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    limit: '16kb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send('Hello, this is the home page!');
}); 

// declare routes and attach routers

import userRouter from './routes/user.routes';
import listingRouter from './routes/listing.routes';

app.use('/api/v1/users', userRouter)
app.use('/api/v1/listings', listingRouter)

export {app}

