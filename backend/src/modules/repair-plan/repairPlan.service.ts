import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import HTTP_STATUS from '../../constants/http.constants';
import REPAIR_PLAN_MSG_CONSTANTS from './repairPlan.constant';
import { prisma } from '../../config/prisma';
import { ROLE, PRIORITY } from '../../constants/feild.constants';
import socketMessage from '../../config/socket';
import InspectionLog from '../inspectionlogs/inspectionlog.model';

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


    /**
     * @method RepairPlanService:generateRepairPlan
     * @description Generates a repair plan based on inspection findings.
     * @param inspectionId 
     * @returns 
    **/
    async generateRepairPlan(inspectionId: string, fetch: boolean = false) {
        try {
            this.logger.info('Inside RepairPlanService - generateRepairPlan method');

            if (fetch) {
                const existingPlan = await prisma.repairPlan.findUnique({ where: { inspectionId } });
                if (!existingPlan) {
                    throw new CustomError(REPAIR_PLAN_MSG_CONSTANTS.REPAIR_PLAN_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
                }
                return {
                    message: REPAIR_PLAN_MSG_CONSTANTS.REPAIR_PLAN_FETCHED,
                    data: existingPlan,
                };
            }

            // 1. Fetch all findings for this inspection
            const findings = await prisma.finding.findMany({ where: { inspectionId } });


            if (findings.length === 0) {
                throw new CustomError(REPAIR_PLAN_MSG_CONSTANTS.NO_FINDINGS_FOR_INSPECTION, HTTP_STATUS.NOT_FOUND);
            }

            // 2. Calculate Total Cost
            const totalEstimatedCost = findings.reduce((sum, finding) => sum + (finding.estimatedCost || 0), 0);

            // 3. Determine Priority based on Max Severity
            // Rule: HIGH ≥ 5, MEDIUM 3–4, LOW < 3
            const maxSeverity = Math.max(...findings.map(f => f.severity));

            let priority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
            if (maxSeverity >= 5) {
                priority = 'HIGH';
            } else if (maxSeverity >= 3) {
                priority = 'MEDIUM';
            }

            // 4. Create or Update (Upsert) the Repair Plan
            // We use upsert to handle cases where a plan might be regenerated
            const repairPlan = await prisma.repairPlan.upsert({
                where: { inspectionId },
                update: {
                    priority,
                    totalEstimatedCost,
                    snapshotJson: findings, // Save current findings as a snapshot
                    createdAt: new Date()   // Update timestamp effectively
                },
                create: {
                    inspectionId,
                    priority,
                    totalEstimatedCost,
                    snapshotJson: findings
                }
            });

            await socketMessage.sendMessage({
                type: 'REPAIR_PLAN_GENERATED',
                inspectionId: inspectionId,
                data: repairPlan
            });

            // We don't await this because we don't want to block the main response if logging fails
            (async () => {
                try {
                    await InspectionLog.create({
                        kind: 'PLAN_GENERATED',
                        inspectionId: inspectionId,
                        details: {
                            totalCost: repairPlan.totalEstimatedCost,
                            priority: repairPlan.priority,
                            findingsCount: findings.length
                        }
                    });
                    this.logger.info(`[NoSQL] Logged plan generation for ${inspectionId}`);
                } catch (logErr) {
                    this.logger.error(`[NoSQL] Failed to log plan generation: ${logErr}`);
                }
            })();

            return {
                message: REPAIR_PLAN_MSG_CONSTANTS.REPAIR_PLAN_CREATE,
                data: repairPlan,
            };

        } catch (error: any) {
            this.logger.error(`Inside RepairPlanService - generateRepairPlan method - Error: ${error.message}`);
            // Rethrow specific errors or generic internal server error
            if (error instanceof CustomError) throw error;
            throw new CustomError('Error generating repair plan', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }


}

export default new RepairPlanService();