import { Router, Request, Response, NextFunction } from "express";


import UserRoutes from "./../src/modules/users/user.route";


const router = Router();


router.use('/user', UserRoutes);


export default router;