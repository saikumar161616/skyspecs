import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import HTTP_STATUS from '../../constants/http.constants';
import FINDING_MSG_CONSTANTS from './finding.constant';
import { ROLE } from '../../constants/feild.constants';
import { prisma } from '../../config/prisma';
import InspectionLog from '../inspectionlogs/inspectionlog.model';

class FindingService extends Default {
    constructor() {
        super();
    }

    async createFinding(findingData: any, reqUser: any, inspectionId: string) {
        try {
            this.logger.info('Inside FindingService - createFinding method');

            let inspection = null;

            // Associate the finding with the inspection
            if (inspectionId) inspection = await prisma.inspection.findUnique({ where: { id: inspectionId } });
            if (!inspection) throw new CustomError(FINDING_MSG_CONSTANTS.INSPECTION_FINDINGS_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            if (reqUser && reqUser.role == ROLE.VIEWER) throw new CustomError('Unauthorized to create finding', HTTP_STATUS.UNAUTHORIZED);


            const newFinding = await prisma.finding.create({
                data: {
                    ...findingData,
                    inspectionId: inspection.id,
                    createdBy: reqUser ? reqUser.id : null,
                    createdAt: new Date(),
                },
            });

            // We don't await this because we don't want to block the main response if logging fails
            (async () => {
                try {
                    await InspectionLog.create({
                        kind: 'FINDING_ADDED',
                        inspectionId: inspection.id,
                        details: {
                            category: newFinding.category,
                            severity: newFinding.severity,
                            estimatedCost: newFinding.estimatedCost,
                        }
                    });
                    this.logger.info(`[NoSQL] Logged plan generation for ${inspectionId}`);
                } catch (logErr) {
                    this.logger.error(`[NoSQL] Failed to log plan generation: ${logErr}`);
                }
            })();

            return {
                message: FINDING_MSG_CONSTANTS.FINDING_CREATE,
                data: newFinding,
            };
        } catch (error: any) {
            console.log(error);
            this.logger.error(`Error in createFinding: ${error.message}`);
            throw new CustomError('Error creating finding', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    async updateFinding(findingId: string, updateData: any, reqUser: any) {
        try {
            this.logger.info('Inside FindingService - updateFinding method');

            const existingFinding = await prisma.finding.findUnique({ where: { id: findingId } });
            if (!existingFinding) {
                throw new CustomError(FINDING_MSG_CONSTANTS.FINDING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            }

            if (reqUser && reqUser.role === ROLE.VIEWER) {
                throw new CustomError('Unauthorized to update finding', HTTP_STATUS.FORBIDDEN);
            }


            console.log('Update Data:', updateData);

            const updatedFinding = await prisma.finding.update({
                where: { id: findingId },
                data: {
                    ...updateData,
                    updatedBy: reqUser.id, // ✅ Use updatedBy instead of updater
                },
                include: {
                    updater: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    inspection: {
                        select: {
                            id: true,
                            date: true,
                            turbine: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });

            // We don't await this because we don't want to block the main response if logging fails
            (async () => {
                try {
                    await InspectionLog.create({
                        kind: 'FINDING_UPDATED',
                        inspectionId: existingFinding.inspectionId,
                        details: {
                            category: updatedFinding.category,
                            severity: updatedFinding.severity,
                            estimatedCost: updatedFinding.estimatedCost,
                        }
                    });
                    this.logger.info(`[NoSQL] Logged plan generation for ${existingFinding.id}`);
                } catch (logErr) {
                    this.logger.error(`[NoSQL] Failed to log plan generation: ${logErr}`);
                }
            })();

            return {
                message: FINDING_MSG_CONSTANTS.FINDING_UPDATE,
                data: updatedFinding,
            };
        } catch (error: any) {
            this.logger.error(`Error in updateFinding: ${error.message || error}`);
            throw new CustomError(
                (error instanceof CustomError) ? error.message : 'Error updating finding',
                error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
            );
        }
    }

    async fetchFindingsByInspectionId(inspectionId: string, searchTerm?: any) {
        try {
            this.logger.info('Inside FindingService - fetchFindings method');

            // Construct dynamic where clause
            const whereClause: any = {
                inspectionId
            };

            // If search term exists, filter by notes
            if (searchTerm) {
                whereClause.notes = {
                    contains: searchTerm,
                    mode: 'insensitive', // Makes search case-insensitive (e.g. 'Crack' matches 'crack')
                };
            }

            console.log('Where Clause:', whereClause);

            const findings = await prisma.finding.findMany({ where: whereClause, include: { creator: { select: { id: true, name: true, email: true } } } });

            return {
                message: FINDING_MSG_CONSTANTS.FINDING_FETCHED,
                data: findings,
            };
        } catch (error: any) {
            this.logger.error(`Error in fetchFindings: ${error.message}`);
            throw new CustomError('Error fetching findings', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new FindingService();