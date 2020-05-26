/*
 * Created on Tue Feb 11 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const { Storage } = require("@google-cloud/storage");
const moment = require("moment");
exports.uploadFile = async (bucketName, fileName, fileData, contentType) => {
  const storage = new Storage();

  await storage.bucket(bucketName).file(fileName).save(fileData, {
    contentType: contentType,
  });
};

exports.isFileExist = async (bucketName, fileName) => {
  const storage = new Storage();

  console.log("bucket", bucketName);

  const res = await storage.bucket(bucketName).file(fileName).exists();
  return res[0];
};

exports.getFileUrl = async (bucketName, fileName) => {
  const options = {
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  };
  const storage = new Storage();
  const url = await storage
    .bucket(bucketName)
    .file(fileName)
    .getSignedUrl(options);  
  return url[0];
};

exports._getFileUrl = (bucketName, fileName) => {
  return `https://storage.cloud.google.com/${bucketName}/${fileName}`;
};

exports.deleteFile = async (bucketName, fileName) => {
  const storage = new Storage();

  await storage.bucket(bucketName).file(fileName).delete();
};
