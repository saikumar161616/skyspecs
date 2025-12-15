import { Router } from 'express';
import inspectionLogController from './inspectionlog.controller';
import authMiddleware from '../../config/authMiddleware';

const router = Router();

// fetch inspections logs by inspection ID
router.get('/:inspectionId',
    (req, res, next) => authMiddleware.verifyToken(req, res, next),
    (req, res) => inspectionLogController.fetchInspectionLogsByInspectionController(req, res)
);

export default router;