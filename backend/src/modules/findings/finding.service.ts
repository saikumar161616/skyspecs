import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import HTTP_STATUS from '../../constants/http.constants';
import FINDING_MSG_CONSTANTS from './finding.constant';
import { ROLE } from '../../constants/feild.constants';
import { prisma } from '../../config/prisma';

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
            if (reqUser && reqUser.role !== ROLE.ENGINEER) throw new CustomError('Unauthorized to create finding', HTTP_STATUS.UNAUTHORIZED);


            const newFinding = await prisma.finding.create({
                data: {
                    ...findingData,
                    inspectionId: inspection.id,
                    createdBy: reqUser ? reqUser.id : null,
                    createdAt: new Date(),
                },
            });

            return {
                message: FINDING_MSG_CONSTANTS.FINDING_CREATE,
                data: newFinding,
            };
        } catch (error: any) {
            this.logger.error(`Error in createFinding: ${error.message}`);
            throw new CustomError('Error creating finding', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    async updateFinding(findingId: string, updateData: any) {
        try {
            this.logger.info('Inside FindingService - updateFinding method');

            const existingFinding = await prisma.finding.findUnique({ where: { id: findingId } });
            if (!existingFinding) {
                throw new CustomError(FINDING_MSG_CONSTANTS.FINDING_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
            }

            const updatedFinding = await prisma.finding.update({
                where: { id: findingId },
                data: {
                    ...updateData,
                    updatedAt: new Date(),
                },
            });

            return {
                message: FINDING_MSG_CONSTANTS.FINDING_UPDATE,
                data: updatedFinding,
            };
        } catch (error: any) {
            this.logger.error(`Error in updateFinding: ${error.message}`);
            throw new CustomError('Error updating finding', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }

    async fetchFindings() {
        try {
            this.logger.info('Inside FindingService - fetchFindings method');

            const findings = await prisma.finding.findMany();

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