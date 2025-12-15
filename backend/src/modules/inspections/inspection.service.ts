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

            // if(reqUser.role !==  ROLE.ENGINEER) throw new CustomError('Unauthorized to create inspection', HTTP_STATUS.FORBIDDEN);

            // Check if inspection already exists for this turbine on this date
            const existingInspection = await prisma.inspection.findUnique({
                where: {
                    turbineId_date: {
                        turbineId: inspectionData.turbineId,
                        date: new Date(inspectionData.date)
                    }
                }
            });

            if (existingInspection) {
                throw new CustomError(
                    'An inspection already exists for this turbine on this date',
                    HTTP_STATUS.CONFLICT
                );
            }

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
    async fetchInspections(date?: string, startDate?: any, endDate?: any, turbineId?: string, dataSource?: string) {
        try {
            this.logger.info('Inside InspectionService - fetchInspections method');

            let filter: any = {};

            if (date) {
                const inspectionDate = new Date(date);
                filter.date = inspectionDate;
            }
            else if (startDate || endDate) {
                filter.date = {};
                if (startDate) {
                    filter.date.gte = new Date(startDate); // Greater than or equal to start
                }
                if (endDate) {
                    filter.date.lte = new Date(endDate);   // Less than or equal to end
                }
            }
            if (turbineId) {
                filter.turbineId = turbineId;
            }
            if (dataSource) {
                filter.dataSource = dataSource;
            }

            const inspections = await prisma.inspection.findMany({
                where: filter,
                include: {
                    turbine: true,
                    inspector: { select: { id: true, name: true, email: true, role: true } },
                    creator: { select: { id: true, name: true, email: true, role: true } }
                }
            });


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


    /**
     *  @method InspectionService:fetchInspectionById
     * @description Service to fetch inspection by id.
     * @param id 
     * @returns 
    **/
    async fetchInspectionById(id: string) {
        try {
            this.logger.info('Inside InspectionService - fetchInspectionById method');

            const inspection = await prisma.inspection.findUnique({
                where: { id },
                include: {
                    turbine: true,
                    inspector: { select: { id: true, name: true, email: true, role: true } },
                    creator: { select: { id: true, name: true, email: true, role: true } }
                }
            });

            if (!inspection) throw new CustomError(INSPECTION_MSG_CONSTANTS.INSPECTION_NOT_FOUND, HTTP_STATUS.NOT_FOUND);

            return {
                message: INSPECTION_MSG_CONSTANTS.INSPECTION_FETCHED,
                data: inspection
            };
        }
        catch (error: any) {
            this.logger.error(`Inside InspectionService - fetchInspectionById method - Error while fetching inspection by id: ${error}`);
            throw new CustomError((error instanceof CustomError) ? error.message : 'Error! Please try again later', error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }


}

export default new InspectionService();