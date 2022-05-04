import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';

const router = express.Router()

router.post('/verify', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 6, max: 10 }).withMessage('Password must be within 6 to 10 characters in length'),
    body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('Otp should be six characters in length'),
    validateRequest], async (req: Request, res: Response) => {

        const { email, password, otp } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Invalid credentials');
        }

        if(existingUser.verified){
            throw new BadRequestError('Invalid credentails')
        }

        const passwordsMatch = await Password.compare(existingUser.password, password);

        if (!passwordsMatch) {
            throw new BadRequestError('Invalid credentials');
        }
        const otpMatch = existingUser.otp === otp;

        if (!otpMatch) {
            throw new BadRequestError('Invalid OTP');
        }


        await User.updateOne({ email }, {
            verified: true
        });

        const userJwt = jwt.sign({
            email: existingUser.email,
            id: existingUser.id
        }, process.env.JWT_KEY!)


        return res.status(200).send({ isSuccess: true, message: 'User verified', data: { token: userJwt } });
    })
export { router as verifyRouter };