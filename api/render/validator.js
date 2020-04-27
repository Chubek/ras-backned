/*
 * Created on Wed Feb 12 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const { isTemplateExist, isDummyUserExist } = require('../../services/assetsRepository');

const validateRequest = async (req) => {
    const requestBody = req.body;

    if (!requestBody) {
        return {
            status: 400,
            message: 'Request body in JSON format is not found'
        }
    }    

    if (!req.params.templateId) {
        return {
            status: 400,
            message: 'templateId param is not found'
        };
    }

    if (!(await isTemplateExist(req.params.templateId))) {
        return {
            status: 400,
            message: `Template with id "${req.params.templateId}" is not found`
        };
    }

    return null;
}

exports.validateRequestWithDummyUser = async (req) => {
    const result = await validateRequest(req);
    if (result != null) {
        return result
    }

    if (!req.params.dummyUserId) {
        return {
            status: 400,
            message: 'dummyUserId param is not found'
        };
    }

    if (!(await isDummyUserExist(req.params.dummyUserId))) {
        return {
            status: 400,
            message: `DummyUser with id ${req.params.dummyUserId} is not found`
        }
    }

    return null;
}

exports.validateRequestWithUserData = async (req) => {
    const result = await validateRequest(req);
    if (result != null) {
        return result
    }

    if (!req.body.userData) {
        return {
            status: 400,
            message: `"userData" field is not found in request body`
        }
    }

    return null;
}