import { Router } from 'express';
import findingController from './finding.controller';
import findingMiddleware from './finding.middleware';

const router = Router();

router.post('/', findingMiddleware.prepareCreateFinding, findingController.addFindingController);
router.put('/:id', findingMiddleware.prepareUpdateFinding, findingController.updateFindingController);
router.get('/', findingController.fetchFindingsController);

export default router;