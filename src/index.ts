import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import mongoose from 'mongoose';

import { signUpRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { verifyRouter } from './routes/verify';
import { logoutRouter } from './routes/logout';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';
import { Mailer } from './services/mailer';


const app = express();

dotenv.config();

app.use(express.json());
app.use('/api/users', signUpRouter);
app.use('/api/users', signinRouter)
app.use('/api/users', verifyRouter);
app.use('/api/users', logoutRouter);

app.all('*', async () => {
    throw new NotFoundError()
});
app.use(errorHandler);


const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_key must be defined')
    }
    try {
        Mailer.init(process.env.SEND_GRID_KEY!);
        await mongoose.connect('mongodb+srv://devarshiroy93:Push_1234@cluster0.pxpob.mongodb.net/Pasal?retryWrites=true&w=majority');
        console.log('database connection established');
    } catch (err) {
        console.log('error connecting to database', err)
    }
    app.listen(process.env.PORT, () => {
        console.log(`listening on port ${process.env.PORT}!!`);
    })
}

start();
