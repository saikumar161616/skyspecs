import { Request, Response, NextFunction } from 'express';
import { createFindingSchemaValidator, updateFindingSchemaValidator } from './finding.validation';
import HTTP_STATUS from '../../constants/http.constants';
import { Default } from '../../config/default';

class FindingMiddleware extends Default {
    constructor() {
        super();
    }

    async prepareCreateFinding(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside FindingMiddleware - prepareCreateFinding method');
            const inputValidation = await createFindingSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Error in prepareCreateFinding: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }

    async prepareUpdateFinding(req: Request, res: Response, next: NextFunction) {
        try {
            this.logger.info('Inside FindingMiddleware - prepareUpdateFinding method');
            const inputValidation = await updateFindingSchemaValidator.validateAsync(req.body);
            req.body = inputValidation;
            next();
        } catch (error) {
            this.logger.error(`Error in prepareUpdateFinding: ${error}`);
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid request data', error });
        }
    }
}

export default new FindingMiddleware();