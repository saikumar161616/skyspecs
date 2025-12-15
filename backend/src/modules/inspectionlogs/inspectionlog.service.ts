import { Default } from '../../config/default';
import { CustomError } from '../../error-handlers/custom.error';
import HTTP_STATUS from '../../constants/http.constants';
import InspectionLog from '../inspectionlogs/inspectionlog.model';

class InspectionLogService extends Default {
    constructor() {
        super();
    }


    async fetchLogsByInspectionId(inspectionId: string) {
        try {
            this.logger.info('Inside InspectionLogService - fetchLogsByInspectionId method');

            const logs = await InspectionLog.find({ inspectionId }).sort({ createdAt: -1 });

            console.log(logs, 'in 18');

            return {
                message: `Inspection logs fetched successfully`,
                data: logs,
            };
        } catch (error: any) {
            this.logger.error(`Error in fetchFindings: ${error.message}`);
            throw new CustomError('Error fetching findings', HTTP_STATUS.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new InspectionLogService();