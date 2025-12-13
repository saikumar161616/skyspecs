import joi from 'joi';
import { STATUS } from '../../constants/feild.constants';


export const createTurbineSchemaValidastor = joi.object({
    name : joi.string().min(3).required(),
    manufacturer: joi.string().required(),
    status : joi.string().valid(...Object.values(STATUS)).required(),
    mwRating : joi.number().precision(2).positive().required(),
    lat : joi.number().min(-90).max(90).strict().required(),
    lng : joi.number().min(-180).max(180).precision(6).strict().required(),
});

export const updateTurbineSchemaValidator = joi.object({
    name : joi.string().min(3),
    manufacturer: joi.string(),
    status : joi.string().valid(...Object.values(STATUS)),
    mwRating : joi.number().precision(2).positive(),
    lat : joi.number().min(-90).max(90).strict(),
    lng : joi.number().min(-180).max(180).precision(6).strict(),
});




