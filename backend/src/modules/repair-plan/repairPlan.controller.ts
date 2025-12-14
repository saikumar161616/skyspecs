import { Request, Response } from 'express';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import repairPlanService from './repairPlan.service';

class RepairPlanController extends Default {
    constructor() {
        super();
    }

    async addRepairPlanController(req: any, res: any) {
        try {
            this.logger.info('Inside RepairPlanController - addRepairPlanController method');
            const response = await repairPlanService.createRepairPlan(req.body);
            return res.status(HTTP_STATUS.CREATED).json({
                status: true,
                message: response.message,
                data: response.data,
            });
        } catch (error: any) {
            this.logger.error(`Error in addRepairPlanController: ${error.message}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message,
                    status: false,
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: 'Internal server error',
            });
        }
    }

    async updateRepairPlanController(req: Request, res: Response) {
        try {
            this.logger.info('Inside RepairPlanController - updateRepairPlanController method');
            const response = await repairPlanService.updateRepairPlan(req.params.id, req.body);
            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data,
            });
        } catch (error: any) {
            this.logger.error(`Error in updateRepairPlanController: ${error.message}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message,
                    status: false,
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: 'Internal server error',
            });
        }
    }

    async generateRepairPlansController(req: any, res: any) {
        try {
            this.logger.info('Inside RepairPlanController - fetchRepairPlansController method');
            req.query.fetch = req.query.fetch ? true : false;
            const response = await repairPlanService.generateRepairPlan(req.params.inspectionId, req.query.fetch);
            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data,
            });
        } catch (error: any) {
            this.logger.error(`Error in fetchRepairPlansController: ${error.message}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message,
                    status: false,
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: 'Internal server error',
            });
        }
    }
}

export default new RepairPlanController();