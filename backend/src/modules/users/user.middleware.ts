import { Request, Response, NextFunction } from 'express';
import { createUserSchemaValidastor, updateUserSchemaValidator, loginUserSchemaValidator, changePasswordSchemaValidator } from './user.validation';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';


class UserMiddleware extends Default {
    constructor() {
        super();
    }

    /**
     * @method prepareCreateUser
     * @description Middleware to validate and prepare the request body for creating a new user.
     * @param req 
     * @param res 
     * @param next 
     * @returns 
    */
    async prepareCreateUser(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside UserMiddleware - prepareCreateUser method');
            const inputValidation = await createUserSchemaValidastor.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside UserMiddleware - prepareCreateUser method - Error while validating create user request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }

    /**
     * @method prepareUpdateUser
     * @description Middleware to validate and prepare the request body for updating an existing user.
     * @param req 
     * @param res
     * @param next 
     * @returns 
    */
    
    async prepareUpdateUser(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside UserMiddleware - prepareUpdateUser method');
            const inputValidation = await updateUserSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside UserMiddleware - prepareUpdateUser method - Error while validating update user request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }


    async prepareLoginUser(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside UserMiddleware - prepareLoginUser method');
            const inputValidation = await loginUserSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside UserMiddleware - prepareLoginUser method - Error while validating login user request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }

    async prepareChangePassword(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside UserMiddleware - prepareChangePassword method');
            const inputValidation = await changePasswordSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Inside UserMiddleware - prepareChangePassword method - Error while validating change password request: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }   




}

export default new UserMiddleware();