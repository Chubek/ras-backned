/*
 * Created on Tue Feb 11 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const { Storage } = require('@google-cloud/storage');

exports.uploadFile = async (bucketName, fileName, fileData, contentType) => {
    const storage = new Storage();

    await storage.bucket(bucketName).file(fileName).save(fileData, {
        contentType: contentType
    });
};

exports.isFileExist = async (bucketName, fileName) => {
    const storage = new Storage();

    const res = await storage.bucket(bucketName).file(fileName).exists();
    return res[0];
}

exports.getFileUrl = (bucketName, fileName) => {
    return `https://storage.cloud.google.com/${bucketName}/${fileName}`
}