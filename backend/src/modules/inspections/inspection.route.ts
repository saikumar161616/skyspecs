import { NextFunction, Request, Response, Router} from 'express';
import AuthMiddleware from '../../config/authMiddleware';

const router = Router();

/**
 * @route /inspections
 * @description Route to handle inspections-related operations.
*/

// Create a new inspection    
router.post('/',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),

);

// Update an existing inspection
router.patch('/:id',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next)
);


// fetch inspections 
router.get('/',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),

);



export default router;