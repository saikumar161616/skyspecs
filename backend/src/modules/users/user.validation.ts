import joi from 'joi';
import { ROLE } from '../../constants/feild.constants';


export const createUserSchemaValidastor = joi.object({
    name : joi.string().min(3).required(),
    email: joi.string().email().required(),    
    passwordHash: joi.string().min(6).required(),
    role : joi.string().valid(...Object.values(ROLE)).required(),
});

export const updateUserSchemaValidator = joi.object({
    name : joi.string().min(3),
    email: joi.string().email(),
    passwordHash: joi.string().min(6),
});

export const loginUserSchemaValidator = joi.object({
    email: joi.string().email().required(),
    passwordHash: joi.string().min(6).required(),
});

export const changePasswordSchemaValidator = joi.object({
    oldPassword: joi.string().min(6).required(),
    newPassword: joi.string().min(6).required(),
});

