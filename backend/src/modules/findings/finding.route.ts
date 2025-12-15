import { Router } from 'express';
import findingController from './finding.controller';
import findingMiddleware from './finding.middleware';
import authMiddleware from '../../config/authMiddleware';

const router = Router();

// post finding
router.post('/:inspectionId',
    (req, res, next) => authMiddleware.verifyToken(req, res, next),
    (req, res, next) => findingMiddleware.prepareCreateFinding(req, res, next),
    (req, res) => findingController.addFindingController(req, res)
);

// update finding
router.patch('/:id',
    (req, res, next) => authMiddleware.verifyToken(req, res, next),
    (req, res, next) => findingMiddleware.prepareUpdateFinding(req, res, next),
    (req, res) => findingController.updateFindingController(req, res)
);

// fetch findings
router.get('/:inspectionId',
    (req, res, next) => authMiddleware.verifyToken(req, res, next),
    (req, res) => findingController.fetchFindingsByInspectionController(req, res)
);

export default router;