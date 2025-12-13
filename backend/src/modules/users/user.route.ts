import { NextFunction, Request, Response, Router} from 'express';
import UserMiddleware from './user.middleware'; 
import UserController from './user.controller';

// import AuthMiddleware from '../../config/authMiddleware';

const router = Router();

/**
 * @route /users
 * @description Route to handle user-related operations.
*/


router.post('/',
    (req: Request, res: Response, next: NextFunction) => UserMiddleware.prepareCreateUser(req, res, next),
    (req: Request, res: Response) => UserController.addUserController(req, res)
);


export default router;