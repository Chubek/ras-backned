/*
 * Created on Wed Feb 12 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const express = require('express');

const { silentErrorHandler, notFoundHandler } = require('../helpers');
const { uploadFile, isFileExist, getFileUrl } = require('../../services/fileStorage');
const { renderPageToPng } = require('../../services/browserRenderer');
const { readAndCompileTemplate } = require('../../services/templateCompiler');
const { getTemplateById, getDummyUserById } = require('../../services/assetsRepository');
const { getResumeHash } = require('../../services/hashService');
const { validateRequestWithUserData, validateRequestWithDummyUser } = require('./validator');

const { RENDERED_RESUME_DATA_STORAGE } = process.env;
const app = express();

const renderAndSaveResumeOrGetFromCache = async (templateId, userData, options) => {
    const hash = getResumeHash(templateId, { userData, options });
    const pngFileName = `${hash}.png`;

    const isExist = await isFileExist(RENDERED_RESUME_DATA_STORAGE, pngFileName);
    const result = {
        pngUrl: getFileUrl(RENDERED_RESUME_DATA_STORAGE, pngFileName),
        pdfUrl: ``
    }

    if (isExist) {
        return result;
    }

    const template = await getTemplateById(templateId);
    const html = await readAndCompileTemplate(template.path, userData);
    const pngData = await renderPageToPng(html, `file:${template.basePath}`, options);
    await uploadFile(RENDERED_RESUME_DATA_STORAGE, pngFileName, pngData, 'image/png');

    return result;
}

app.post('/:templateId/:dummyUserId', (req, res) => {
    validateRequestWithDummyUser(req)
        .then(async (validationResult) => {
            if (validationResult !== null) {
                res.status(validationResult.status).json({ message: validationResult.message });
                return;
            }

            const userData = await getDummyUserById(req.params.dummyUserId);
            const result = await renderAndSaveResumeOrGetFromCache(req.params.templateId, userData, req.body.options || {});
            res.status(200).json(result);
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })
});

app.post('/:templateId', (req, res) => {
    validateRequestWithUserData(req)
        .then(async (validationResult) => {
            if (validationResult !== null) {
                res.status(validationResult.status).json({ message: validationResult.message });
                return;
            }

            const result = await renderAndSaveResumeOrGetFromCache(req.params.templateId, req.body.userData, req.body.options || {});
            res.status(200).json(result);           
        })
        .catch(err => {
            console.error(err);
            res.sendStatus(500);
        })
});

app.use('*', notFoundHandler);
app.use(silentErrorHandler);

module.exports = app;