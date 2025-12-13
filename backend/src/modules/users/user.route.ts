import { NextFunction, Request, Response, Router} from 'express';
import UserMiddleware from './user.middleware'; 
import UserController from './user.controller';

// import AuthMiddleware from '../../config/authMiddleware';

const router = Router();

/**
 * @route /users
 * @description Route to handle user-related operations.
*/

// Create a new user
router.post('/',
    (req: Request, res: Response, next: NextFunction) => UserMiddleware.prepareCreateUser(req, res, next),
    (req: Request, res: Response) => UserController.addUserController(req, res)
);

// Update an existing user
router.patch('/:id',
    (req: Request, res: Response, next: NextFunction) => UserMiddleware.prepareUpdateUser(req, res, next),
    (req: Request, res: Response) => UserController.updateUserController(req, res)
);


// login user
router.post('/login',
    (req: Request, res: Response, next: NextFunction) => UserMiddleware.prepareLoginUser(req, res, next),
    (req: Request, res: Response) => UserController.loginUserController(req, res)
);


export default router;