import { Request, Response, NextFunction } from 'express';
import { createRepairPlanSchemaValidator, updateRepairPlanSchemaValidator } from './repairPlan.validation';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';

class RepairPlanMiddleware extends Default {
    constructor() {
        super();
    }

    async prepareCreateRepairPlan(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside RepairPlanMiddleware - prepareCreateRepairPlan method');
            const inputValidation = await createRepairPlanSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Error in prepareCreateRepairPlan: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }

    async prepareUpdateRepairPlan(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside RepairPlanMiddleware - prepareUpdateRepairPlan method');
            const inputValidation = await updateRepairPlanSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Error in prepareUpdateRepairPlan: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }
}

export default new RepairPlanMiddleware();