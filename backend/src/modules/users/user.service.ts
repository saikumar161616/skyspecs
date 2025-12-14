import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import HTTP_STATUS from "../../constants/http.constants";
import { ROLE, STATUS } from "../../constants/feild.constants";
import USER_MSG_CONSTANTS from "./user.constant";
import { prisma } from "../../config/prisma";
import { helperUtil } from "../../utilities/helper.utils";

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
            const existingUser = await prisma.user.findUnique({ where: { email: userData?.email } });
            if (existingUser) throw new CustomError(USER_MSG_CONSTANTS.USER_ALREADY_EXISTS, HTTP_STATUS.CONFLICT);

            // Hash the password before saving
            const hashedPassword = await helperUtil.hashData(userData.password);
            userData.passwordHash = hashedPassword;

            // Create new user
            const newUser = { ...userData, status: STATUS.ACTIVE };

            // Save to database 
            await prisma.user.create({ data: newUser, select: { id: true, name: true, email: true, role: true, status: true } });

            return {
                message: USER_MSG_CONSTANTS.USER_CREATED,
                data: newUser
            };
        } catch (error: any) {
            this.logger.error(`Inside UserService - createUser method - Error while creating user: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * @method UserService:updateUser
     * @description Service to update an existing user.
     * @param userId 
     * @param updateData 
     * @returns 
    **/
    async updateUser(userId: string, updateData: any) {
        try {
            this.logger.info('Inside UserService - updateUser method');

            // Check if user exists and check status
            const existingUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!existingUser) throw new CustomError(USER_MSG_CONSTANTS.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            // If password is being updated, hash the new password
            if (updateData.passwordHash) {
                const hashedPassword = await helperUtil.hashData(updateData.passwordHash);
                updateData.passwordHash = hashedPassword;
            }

            // Update user in database
            const updatedUser = await prisma.user.update({ where: { id: userId }, data: updateData, select: { id: true, name: true, email: true, role: true, status: true } });

            return {
                message: USER_MSG_CONSTANTS.USER_UPDATED,
                data: updatedUser
            };
        } catch (error: any) {
            this.logger.error(`Inside UserService - updateUser method - Error while updating user: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }


    // login service,
    /**
     * @method UserService:loginUser
     * @description Service to login a user.
     * @param email 
     * @param password 
     * @returns 
    **/
    async loginUser(email: string, password: string) {
        try {
            this.logger.info('Inside UserService - loginUser method');

            // Find user by email
            let user = await prisma.user.findUnique({ where: { email } });
            if (!user) throw new CustomError(USER_MSG_CONSTANTS.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            if (user.status === STATUS.INACTIVE) throw new CustomError(USER_MSG_CONSTANTS.USER_INACTIVE, HTTP_STATUS.BAD_REQUEST);

            // Compare password
            const isPasswordValid = await helperUtil.compareData(password, user.passwordHash);
            if (!isPasswordValid) throw new CustomError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);

            // Remove passwordHash
            const { passwordHash, ...userWithoutPassword } = user;


            // generate token logic
            const token = await this.jwtTokenGenerator(userWithoutPassword);


            return {
                message: USER_MSG_CONSTANTS.USER_LOGGED_IN,
                data: token
            };

            
        } catch (error: any) {
            this.logger.error(`Inside UserService - loginUser method - Error while logging in user: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * @method UserService:fetchUsers
     * @description Service to fetch all users.
     * @returns 
    **/
    async fetchUsers(reqUser: any) {
        try {
            this.logger.info('Inside UserService - fetchUsers method');

            if (reqUser.role === ROLE.ENGINEER) throw new CustomError('You dont have access', HTTP_STATUS.FORBIDDEN);

            const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true } });
            
            return {
                message: USER_MSG_CONSTANTS.USER_FETCHED,
                data: users
            };
        } catch (error: any) {
            this.logger.error(`Inside UserService - fetchUsers method - Error while fetching users: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }    
    

}

export default new UserService();