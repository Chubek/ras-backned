/*
 * Created on Wed Feb 12 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const hash = require('object-hash');

function getResumeHash(templateId, data) {
    if (!templateId) {
        throw new Error('Specify templateId');
    }

    if (!data) {
        throw new Error('Specify data');
    }

    return `${templateId}-${hash(data)}`;
}

exports.getResumeHash = getResumeHash