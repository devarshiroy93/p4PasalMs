import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';


const router = express.Router()

router.post('/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
    validateRequest
], async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    
    if (!existingUser?.verified) {
        throw new BadRequestError('User not verified.')
    }

    if (!existingUser) {
        throw new BadRequestError('Invalid login credentials');
    }

    const passwordsMatch = await Password.compare(existingUser.password, password);

    if (!passwordsMatch) {
        throw new BadRequestError('Invalid login credentials');
    }

    //generate JWT 

    const userJwt = jwt.sign({
        email: existingUser.email,
        id: existingUser.id
    }, process.env.JWT_KEY!)

    res.status(201).send({ isSuccess: true, messsage: 'Signed in successfully', data: { token: userJwt } })

})
export { router as signinRouter };