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

app.get('/', (req, res) => {
    res.send('Hello, this is the home page!');
}); 

// declare routes and attach routers

import userRouter from './routes/user.routes';

app.use('/api/v1/users', userRouter)

export {app}

