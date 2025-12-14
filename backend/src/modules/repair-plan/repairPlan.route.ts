import { Router } from 'express';
import repairPlanController from './repairPlan.controller';
import repairPlanMiddleware from './repairPlan.middleware';

const router = Router();

router.post('/', repairPlanMiddleware.prepareCreateRepairPlan, repairPlanController.addRepairPlanController);
router.put('/:id', repairPlanMiddleware.prepareUpdateRepairPlan, repairPlanController.updateRepairPlanController);
router.get('/', repairPlanController.fetchRepairPlansController);

export default router;