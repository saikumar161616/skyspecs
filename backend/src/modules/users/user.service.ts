import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import HTTP_STATUS from "../../constants/http.constants";
import { STATUS } from "../../constants/feild.constants";
import USER_MSG_CONSTANTS from "./user.constant";
import { prisma } from "../../config/prisma";

class UserService extends Default {
    constructor() {
        super();
    }

    /**
     * @method UserService:createUser
     * @description Service to create a new user.
     * @param userData 
     * @returns 
    **/
    async createUser(userData: any) {
        try {
            this.logger.info('Inside UserService - createUser method');

            // Check if user with the same email already exists
            const existingUser = await prisma.user.findUnique({ where: { email : userData?.email } });
            if (existingUser) throw new CustomError(USER_MSG_CONSTANTS.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);
            

            // Create new user
            const newUser = { ...userData, status: STATUS.ACTIVE };

            // Save to database 
            await prisma.user.create({ data: newUser });

            return {
                message: USER_MSG_CONSTANTS.USER_CREATED,
                data: newUser
            };
        } catch (error) {
            this.logger.error(`Inside UserService - createUser method - Error while creating user: ${error}`);
            throw error;
        }
    } 



}

export default new UserService();