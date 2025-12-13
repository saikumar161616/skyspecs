import { Default } from "../../config/default";
import { CustomError } from "../../error-handlers/custom.error";
import HTTP_STATUS from "../../constants/http.constants";
import { STATUS, ROLE } from "../../constants/feild.constants";
import INSPECTION_MSG_CONSTANTS from "./inspections.constant";
import { prisma } from "../../config/prisma";
import { helperUtil } from "../../utilities/helper.utils";

class InspectionService extends Default {
    constructor() {
        super();
    }

    /**
     * @method InspectionService:createInspection
     * @description Service to create a new inspection.
     * @param userData 
     * @returns 
    **/
    async createInspection(inspectionData: any, reqUser: any) {
        try {
            this.logger.info('Inside InspectionService - createInspection method');

            if(reqUser.role !==  ROLE.ENGINEER) throw new CustomError('Unauthorized to create inspection', HTTP_STATUS.FORBIDDEN);

            await prisma.inspection.create({
                data: {
                    ...inspectionData,
                    createdBy: reqUser.id
                }
            });

            return {
                message: INSPECTION_MSG_CONSTANTS.INSPECTION_CREATE,
                data: inspectionData
            };
        } catch (error: any) {
            this.logger.error(`Inside InspectionService - createInspection method - Error while creating inspection: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }


    /**
     * @method InspectionService:updateInspection
     * @description Service to update an existing inspection.
     * @param inspectionId 
     * @param updateData 
     * @returns 
    **/
    async updateInspection(inspectionId: string, updateData: any, reqUser: any) {
        try {
            this.logger.info('Inside InspectionService - updateInspection method');

            // Check if inspection exists
            const existingInspection = await prisma.inspection.findUnique({ where: { id: inspectionId } });
            if (!existingInspection) throw new CustomError(INSPECTION_MSG_CONSTANTS.INSPECTION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            // Update inspection
            await prisma.inspection.update({
                where: { id: inspectionId },
                data: {
                    ...updateData,
                    updatedBy: reqUser.id,
                    updatedAt: new Date()
                }
            });


            return {
                message: INSPECTION_MSG_CONSTANTS.INSPECTION_UPDATE,
                data: updateData
            };
        } catch (error: any) {
            this.logger.error(`Inside InspectionService - updateInspection method - Error while updating inspection: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }



    /**
     * @method InspectionService:fetchInspections
     * @description Service to fetch inspections.
     * @returns 
    **/
    async fetchInspections() {
        try {
            this.logger.info('Inside InspectionService - fetchInspections method');

            const inspections = await prisma.inspection.findMany({ where: { status: { equals: STATUS.ACTIVE } } });

            return {
                message: INSPECTION_MSG_CONSTANTS.INSPECTION_FETCHED,
                data: inspections
            };
        }
        catch (error: any) {
            this.logger.error(`Inside InspectionService - fetchInspections method - Error while fetching inspections: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }



}

export default new InspectionService();