import { Router, Request, Response, NextFunction } from "express";


import UserRoutes from "./../src/modules/users/user.route";
import TurbineRoutes from "./../src/modules/turbines/turbine.route";
import InspectionRoutes from "./../src/modules/inspections/inspection.route";
import FindingRoutes from "./../src/modules/findings/finding.route";
import RepairPlanROutes from "./../src/modules/repair-plan/repairPlan.route";


const router = Router();

router.use('/user', UserRoutes);
router.use('/turbine', TurbineRoutes);
router.use('/inspection', InspectionRoutes);
router.use('/finding', FindingRoutes);
router.use('/repair-plan', RepairPlanROutes);



export default router;