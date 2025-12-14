import { Router } from 'express';
import repairPlanController from './repairPlan.controller';
import repairPlanMiddleware from './repairPlan.middleware';
import authMiddleware from '../../config/authMiddleware';

const router = Router();

// router.post('/', repairPlanMiddleware.prepareCreateRepairPlan, repairPlanController.addRepairPlanController);
// router.put('/:id', repairPlanMiddleware.prepareUpdateRepairPlan, repairPlanController.updateRepairPlanController);
// router.get('/', repairPlanController.fetchRepairPlansController);

// router.post('/',  
//     (req, res, next) => authMiddleware.verifyToken(req, res, next),
//     (req, res, next) => repairPlanMiddleware.prepareCreateRepairPlan(req, res, next),
//     (req, res) => repairPlanController.addRepairPlanController(req, res)
// );


// router.put('/:id',
//     (req, res, next) => authMiddleware.verifyToken(req, res, next),
//     (req, res, next) => repairPlanMiddleware.prepareUpdateRepairPlan(req, res, next),
//     (req, res) => repairPlanController.updateRepairPlanController(req, res)
// );


router.get('/:inspectionId',
    (req, res, next) => authMiddleware.verifyToken(req, res, next),
    (req, res) => repairPlanController.generateRepairPlansController(req, res)
);


export default router;