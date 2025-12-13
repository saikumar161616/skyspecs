import { Request, Response, NextFunction } from 'express';
import { createTurbineSchemaValidastor, updateTurbineSchemaValidator } from './turbine.validation';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';


class TurbineMiddleware extends Default {
    constructor() {
        super();
    }

    /**
     * @method prepareCreateTurbine
     * @description Middleware to validate and prepare the request body for creating a new turbine.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async prepareCreateTurbine(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside TurbineMiddleware - prepareCreateTurbine method');
            const inputValidation = await createTurbineSchemaValidastor.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside TurbineMiddleware - prepareCreateTurbine method - Error while validating create turbine request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }


    /**
     * @method prepareUpdateTurbine
     * @description Middleware to validate and prepare the request body for updating an existing turbine.
     * @param req 
     * @param res
     * @param next 
     * @returns 
    */
    async prepareUpdateTurbine(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside TurbineMiddleware - prepareUpdateTurbine method');
            const inputValidation = await updateTurbineSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside TurbineMiddleware - prepareUpdateTurbine method - Error while validating update turbine request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }


    

}

export default new TurbineMiddleware();