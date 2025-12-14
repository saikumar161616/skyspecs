import joi from 'joi';
import { FINDING_CATEGORY } from '../../constants/feild.constants';

export const createFindingSchemaValidator = joi.object({
    category: joi.string().valid(...Object.values(FINDING_CATEGORY)).required(),
    severity: joi.number().integer().min(1).max(10).required(),
    estimatedCost: joi.number().positive().required(),
    notes: joi.string().optional().allow(null),
});

export const updateFindingSchemaValidator = joi.object({
    category: joi.string().valid(...Object.values(FINDING_CATEGORY)).optional(),
    severity: joi.number().integer().min(1).max(10).optional(),
    estimatedCost: joi.number().positive().optional(),
    notes: joi.string().optional().allow(null),
});