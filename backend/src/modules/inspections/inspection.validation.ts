import joi from 'joi';
import { STATUS, DATA_SOURCES } from '../../constants/feild.constants';


export const createInspectionSchemaValidator = joi.object({
    date: joi.date().required(),
    inspectorId: joi.string().required(),
    dataSource: joi.string().valid(...Object.values(DATA_SOURCES)).required(),
    rawPackageUrl: joi.string().uri().optional().allow(''),
    turbineId: joi.string().required(),
});

export const updateInspectionSchemaValidator = joi.object({
    date: joi.date().optional(),
    inspectorId: joi.string().optional(),
    dataSource: joi.string().valid(...Object.values(DATA_SOURCES)).optional(),
    rawPackageUrl: joi.string().uri().optional().allow(null),
    turbineId: joi.string().optional(),
    status: joi.string().valid(...Object.values(STATUS)).optional(),
});





