import joi from 'joi';

export const createRepairPlanSchemaValidator = joi.object({
    inspectionId: joi.string().required(),
    priority: joi.string().valid('LOW', 'MEDIUM', 'HIGH').required(),
    totalEstimatedCost: joi.number().positive().required(),
    snapshotJson: joi.object().required(),
});

export const updateRepairPlanSchemaValidator = joi.object({
    priority: joi.string().valid('LOW', 'MEDIUM', 'HIGH').optional(),
    totalEstimatedCost: joi.number().positive().optional(),
    snapshotJson: joi.object().optional(),
});