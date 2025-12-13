import { Request, Response, NextFunction } from 'express';
import { createInspectionSchemaValidator, updateInspectionSchemaValidator } from './inspection.validation';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';


class InspectionMiddleware extends Default {
    constructor() {
        super();
    }

    /**
     * @method prepareCreateInspection
     * @description Middleware to validate and prepare the request body for creating a new inspection.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async prepareCreateInspection(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside InspectionMiddleware - prepareCreateInspection method');
            const inputValidation = await createInspectionSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside InspectionMiddleware - prepareCreateInspection method - Error while validating create inspection request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }


    /**
     * @method prepareUpdateInspection
     * @description Middleware to validate and prepare the request body for updating an existing inspection.
     * @param req 
     * @param res
     * @param next 
     * @returns 
    */
    async prepareUpdateInspection(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside InspectionMiddleware - prepareUpdateInspection method');
            const inputValidation = await updateInspectionSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside InspectionMiddleware - prepareUpdateInspection method - Error while validating update inspection request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }




}

export default new InspectionMiddleware();