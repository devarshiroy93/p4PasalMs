import express, { Request, Response } from 'express';


const router = express.Router()

router.post('/logout', (req: Request, res: Response) => {

    return res.status(200).send({isSuccess : false});
})
export { router as logoutRouter };