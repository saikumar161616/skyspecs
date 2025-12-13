import { Request, Response } from "express";
import HTTP_STATUS from "../../constants/http.constants";
import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";


class UserController extends Default {
    constructor() {
        super();
    }

    /**
     * @method UserController:addUserController
     * @description Controller to handle adding a new user.     
     * @param req 
     * @param res 
     * @returns  
     * /
    **/
    async addUserController(req: Request, res: Response) {
        try {
            this.logger.info('Inside UserController - addUserController method');
            const response =  {} //await employeeService.createNewEmployee(req.body);
            if (!response) throw new CustomError('Failed to create employee', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.CREATED).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside UserController - addUserController method - Error while adding new user: ${error}`);
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
     * @method UserController:updateUserController
     * @description Controller to handle updating an existing user.
     * @param req 
     * @param res 
     * @returns 
    **/
    async updateUserController(req: Request, res: Response) {
        try {
            this.logger.info('Inside UserController - updateUserController method');
            const response =  {} //await employeeService.updateExistingEmployee(req.params.id, req.body);
            if (!response) throw new CustomError('Failed to update employee', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside UserController - updateUserController method - Error while updating user: ${error}`);
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
     * @method UserController:loginUserController
     * @description Controller to handle user login.
     * @param req 
     * @param res
     *  @returns
    **/
    async loginUserController(req: Request, res: Response) {
        try {
            this.logger.info('Inside UserController - loginUserController method');
            const response =  {} //await employeeService.loginUser(req.body);
            if (!response) throw new CustomError('Failed to login user', HTTP_STATUS.INTERNAL_SERVER_ERROR);

            return res.status(HTTP_STATUS.OK).json({
                status: true,
                message: response.message,
                data: response.data
            });
        }
        catch (error: any) {
            this.logger.error(`Inside UserController - loginUserController method - Error while logging in user: ${error}`);
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

export default new UserController();