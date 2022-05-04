import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { validateRequest } from '../middlewares/validate-request';
import { User } from '../models/user'
import { Mailer } from '../services/mailer';
import { OtpManager } from '../services/otp-manager';


const router = express.Router()

router.post('/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 6, max: 10 }).withMessage('Password must be within 6 to 10 characters in length'),
    validateRequest
], async (req: Request, res: Response) => {

    //extracting the email password from request body
    const { email, password } = req.body;

    //checking if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        console.log('email in use');
        throw new BadRequestError('user exists');
    }

    const otp = OtpManager.generateOtp();
    const user = User.build({ email, password, otp, verified: false });
    await user.save();
    await new Mailer().sendMail(email,otp)
    return res.status(200).send({ isSuccess: true });
})
export { router as signUpRouter };