import { NextFunction, Request, Response, Router} from 'express';
import AuthMiddleware from '../../config/authMiddleware';

import InspectionMiddleware from './inspection.middleware';
import InspectionController from './inspection.controller';

const router = Router();

/**
 * @route /inspections
 * @description Route to handle inspections-related operations.
*/

// Create a new inspection    
router.post('/',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => InspectionMiddleware.prepareCreateInspection(req, res, next),
    (req: Request, res: Response) => InspectionController.addInspectionController(req, res)

);

// Update an existing inspection
router.patch('/:id',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response, next: NextFunction) => InspectionMiddleware.prepareUpdateInspection(req, res, next),
    (req: Request, res: Response) => InspectionController.updateInspectionController(req, res )
);


// fetch inspections 
router.get('/',
    (req: Request, res: Response, next: NextFunction) => AuthMiddleware.verifyToken(req, res, next),
    (req: Request, res: Response) => InspectionController.fetchInspectionsController(req, res)

);



export default router;