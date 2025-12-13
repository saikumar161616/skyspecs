import { Router, Request, Response, NextFunction } from "express";


import UserRoutes from "./../src/modules/users/user.route";
import TurbineRoutes from "./../src/modules/turbines/turbine.route";
import InspectionRoutes from "./../src/modules/inspections/inspection.route";


const router = Router();

router.use('/user', UserRoutes);
router.use('/turbine', TurbineRoutes);


export default router;