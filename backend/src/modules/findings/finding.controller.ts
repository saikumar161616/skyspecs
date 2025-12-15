import { Request, Response } from 'express';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import findingService from './finding.service';

class FindingController extends Default {
    constructor() {
        super();
    }

    async addFindingController(req: any, res: any) {
        try {
            this.logger.info('Inside FindingController - addFindingController method');
            const response = await findingService.createFinding(req.body, req.user, req.params.inspectionId);
            return res.status(HTTP_STATUS.CREATED).json({
                status: true,
                message: response.message,
                data: response.data,
            });
        } catch (error: any) {
            this.logger.error(`Error in addFindingController: ${error.message}`);
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

    async updateFindingController(req: any, res: any) {
        try {
            this.logger.info('Inside FindingController - updateFindingController method');
            const response = await findingService.updateFinding(req.params.id, req.body, req.user);
            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data,
            });
        } catch (error: any) {
            this.logger.error(`Error in updateFindingController: ${error.message}`);
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

    async fetchFindingsByInspectionController(req: Request, res: Response) {
        try {
            this.logger.info('Inside FindingController - fetchFindingsController method');
            const searchTerm = req.query.search == 'null' ? null : req.query.search;
            const response = await findingService.fetchFindingsByInspectionId(req.params.inspectionId, searchTerm);
            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data,
            });
        } catch (error: any) {
            this.logger.error(`Error in fetchFindingsController: ${error.message}`);
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

export default new FindingController();