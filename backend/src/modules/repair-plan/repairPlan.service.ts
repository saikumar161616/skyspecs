import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import HTTP_STATUS from '../../constants/http.constants';
import REPAIR_PLAN_MSG_CONSTANTS from './repairPlan.constant';
import { prisma } from '../../config/prisma';

class RepairPlanService extends Default {
    constructor() {
        super();
    }

    async createRepairPlan(data: any) {
        try {
            this.logger.info('Inside RepairPlanService - createRepairPlan method');

            const newRepairPlan = await prisma.repairPlan.create({
                data: {
                    ...data,
                    createdAt: new Date(),
                },
            });

            return {
                message: REPAIR_PLAN_MSG_CONSTANTS.REPAIR_PLAN_CREATE,
                data: newRepairPlan,
            };
        } catch (error: any) {
            this.logger.error(`Error in createRepairPlan: ${error.message}`);
            throw new CustomError('Error creating repair plan', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    async updateRepairPlan(id: string, updateData: any) {
        try {
            this.logger.info('Inside RepairPlanService - updateRepairPlan method');

            const existingRepairPlan = await prisma.repairPlan.findUnique({ where: { id } });
            if (!existingRepairPlan) {
                throw new CustomError(REPAIR_PLAN_MSG_CONSTANTS.REPAIR_PLAN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            }

            const updatedRepairPlan = await prisma.repairPlan.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date(),
                },
            });

            return {
                message: REPAIR_PLAN_MSG_CONSTANTS.REPAIR_PLAN_UPDATE,
                data: updatedRepairPlan,
            };
        } catch (error: any) {
            this.logger.error(`Error in updateRepairPlan: ${error.message}`);
            throw new CustomError('Error updating repair plan', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    async fetchRepairPlans() {
        try {
            this.logger.info('Inside RepairPlanService - fetchRepairPlans method');

            const repairPlans = await prisma.repairPlan.findMany();

            return {
                message: REPAIR_PLAN_MSG_CONSTANTS.REPAIR_PLAN_FETCHED,
                data: repairPlans,
            };
        } catch (error: any) {
            this.logger.error(`Error in fetchRepairPlans: ${error.message}`);
            throw new CustomError('Error fetching repair plans', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new RepairPlanService();