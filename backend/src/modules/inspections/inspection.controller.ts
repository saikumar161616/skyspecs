import { Request, Response } from "express";
import HTTP_STATUS from "../../constants/http.constants";
import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import inspectionService from "./inspection.service";


class InspectionController extends Default {
    constructor() {
        super();
    }


    /**
     * @method InspectionController:addInspectionController
     * @description Controller to handle adding a new inspection.     
     * @param req 
     * @param res 
     * @returns  
     * /
    **/
    async addInspectionController(req: any, res: any) {
        try {
            this.logger.info('Inside InspectionController - addInspectionController method');
            const response = await inspectionService.createInspection(req.body, req.user);
            if (!response) throw new CustomError('Failed to create inspection', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.CREATED).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside InspectionController - addInspectionController method - Error while adding new inspection: ${error}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message || error,
                    status: false
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error
            });
        }
    }


    /**
     * @method InspectionController:updateInspectionController
     * @description Controller to handle updating an existing inspection.
     * @param req 
     * @param res 
     * @returns 
    **/
    async updateInspectionController(req: any, res: any) {
        try {
            this.logger.info('Inside InspectionController - updateInspectionController method');
            const response = await inspectionService.updateInspection(req.params.id, req.body, req.user);
            if (!response) throw new CustomError('Failed to update inspection', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside InspectionController - updateInspectionController method - Error while updating inspection: ${error}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message || error,
                    status: false
                });
            }
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error
            });
        }
    }


    /**
     *  * @method InspectionController:fetchInspectionsController
     * @description Controller to handle fetching inspections.
     * @param req 
     * @param res 
     * @returns 
    **/
    async fetchInspectionsController(req: any, res: any) {
        try {
            this.logger.info('Inside InspectionController - fetchInspectionsController method');
            const response = await inspectionService.fetchInspections(req.query.date, req.query.turbineId, req.query.dataSource);
            if (!response) throw new CustomError('Failed to fetch inspections', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside InspectionController - fetchInspectionsController method - Error while fetching inspections: ${error}`);
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({
                    message: error.message || error,
                    status: false
                });
            }   
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                status: false,
                message: error
            });
        }
    }
   
};

export default new InspectionController();