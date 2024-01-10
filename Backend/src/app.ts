import express from 'express';
import cors from 'cors';

const app = express();

// define some middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json({
    limit: '16kb'
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

// declare routes and attach routers

export {app}

