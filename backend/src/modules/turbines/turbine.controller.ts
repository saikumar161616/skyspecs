import { Request, Response } from "express";
import HTTP_STATUS from "../../constants/http.constants";
import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import turbineService from "./turbine.service";


class TurbineController extends Default {
    constructor() {
        super();
    }


    /**
     * @method TurbineController:addTurbineController
     * @description Controller to handle adding a new turbine.     
     * @param req 
     * @param res 
     * @returns  
     * /
    **/
    async addTurbineController(req: any, res: any) {
        try {
            this.logger.info('Inside TurbineController - addTurbineController method');
            const response = await turbineService.createTurbine(req.body, req.user);
            if (!response) throw new CustomError('Failed to create user', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.CREATED).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside TurbineController - addTurbineController method - Error while adding new turbine: ${error}`);
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
     * @method TurbineController:updateUserController
     * @description Controller to handle updating an existing turbine.
     * @param req 
     * @param res 
     * @returns 
    **/
    async updateTurbineController(req: any, res: any) {
        try {
            this.logger.info('Inside TurbineController - updateTurbineController method');
            const response = await turbineService.updateTurbine(req.params.id, req.body, req.user);
            if (!response) throw new CustomError('Failed to update employee', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside TurbineController - updateTurbineController method - Error while updating turbine: ${error}`);
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
     *  * @method TurbineController:fetchTurbinesController
     * @description Controller to handle fetching turbines.
     * @param req 
     * @param res 
     * @returns 
    **/
    async fetchTurbinesController(req: any, res: any) {
        try {
            this.logger.info('Inside TurbineController - fetchTurbinesController method');
            const response = await turbineService.fetchTurbines();
            if (!response) throw new CustomError('Failed to fetch turbines', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside TurbineController - fetchTurbinesController method - Error while fetching turbines: ${error}`);
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

export default new TurbineController();