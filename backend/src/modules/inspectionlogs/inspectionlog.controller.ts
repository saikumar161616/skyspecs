import { Request, Response } from 'express';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import inspectionLogService from './inspectionlog.service';

class InspectionLogController extends Default {
    constructor() {
        super();
    }

    async fetchInspectionLogsByInspectionController(req: Request, res: Response) {
        try {
            this.logger.info('Inside InspectionLogController - fetchFindingsByInspectionController method');
            const response = await inspectionLogService.fetchLogsByInspectionId(req.params.inspectionId);
            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data,
            });
        } catch (error: any) {
            this.logger.error(`Error in fetchFindingsByInspectionController: ${error.message}`);
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

export default new InspectionLogController();