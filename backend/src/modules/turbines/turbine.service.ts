import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import HTTP_STATUS from "../../constants/http.constants";
import { STATUS } from "../../constants/feild.constants";
import TURBINE_MSG_CONSTANTS from "./turbine.constant";
import { prisma } from "../../config/prisma";
import { helperUtil } from "../../utilities/helper.utils";

class TurbineService extends Default {
    constructor() {
        super();
    }

    /**
     * @method TurbineService:createTurbine
     * @description Service to create a new turbine.
     * @param userData 
     * @returns 
    **/
    async createTurbine(turbineData: any, reqUser: any) {
        try {
            this.logger.info('Inside TurbineService - createTurbine method');

            await prisma.turbine.create({
                data: {
                    name: turbineData.name,
                    manufacturer: turbineData.manufacturer,
                    status: turbineData.status,
                    mwRating: turbineData.mwRating,
                    lat: turbineData.lat,
                    lng: turbineData.lng,
                    createdBy: reqUser.id
                }
            });
            
            return {
                message: TURBINE_MSG_CONSTANTS.TURBINE_CREATE,
                data: turbineData
            };
        } catch (error: any) {
            this.logger.error(`Inside TurbineService - createTurbine method - Error while creating turbine: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * @method TurbineService:updateTurbine
     * @description Service to update an existing turbine.
     * @param userId 
     * @param updateData 
     * @returns 
    **/
    async updateTurbine(turbineId: string, updateData: any, reqUser: any) {
        try {
            this.logger.info('Inside TurbineService - updateTurbine method');

            // Check if turbine exists
            const existingTurbine = await prisma.turbine.findUnique({ where: { id: turbineId } });
            if (!existingTurbine) throw new CustomError(TURBINE_MSG_CONSTANTS.TURBINE_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            // Update turbine
            await prisma.turbine.update({
                where: { id: turbineId },
                data: {
                    ...updateData,
                    updatedBy: reqUser.id,
                    updatedAt: new Date()
                }
            }); 


            return {
                message: TURBINE_MSG_CONSTANTS.TURBINE_UPDATE,
                data: updateData
            };
        } catch (error: any) {
            this.logger.error(`Inside TurbineService - updateTurbine method - Error while updating turbine: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }



    /**
     * @method TurbineService:fetchTurbines
     * @description Service to fetch turbines.
     * @returns 
    **/
    async fetchTurbines() {
        try {
            this.logger.info('Inside TurbineService - fetchTurbines method');

            const turbines = await prisma.turbine.findMany({where: { status: { equals: STATUS.ACTIVE } }});
            
            return {
                message: TURBINE_MSG_CONSTANTS.TURBINE_FETCHED,
                data: turbines
            };
        }
        catch (error: any) {    
            this.logger.error(`Inside TurbineService - fetchTurbines method - Error while fetching turbines: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
     


}

export default new TurbineService();