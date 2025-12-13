import { NextFunction, Request, Response, Router} from 'express';
import TurbineMiddleware from './turbine.middleware'; 
import TurbineController from './turbine.controller';
import AuthMiddleware from '../../config/authMiddleware';

const router = Router();

/**
 * @route /turbines
 * @description Route to handle turbines-related operations.
*/

// Create a new turbine    
router.post('/',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => TurbineMiddleware.prepareCreateTurbine(req, res, next),
    (req: Request, res: Response) => TurbineController.addTurbineController(req, res)
);

// Update an existing user
router.patch('/:id',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => TurbineMiddleware.prepareUpdateTurbine(req, res, next),
    (req: Request, res: Response) => TurbineController.updateTurbineController(req, res)
);


// fetch turbines 
router.get('/',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response) => TurbineController.fetchTurbinesController(req, res)
);



export default router;