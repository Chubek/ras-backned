/*
 * Created on Wed Feb 12 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const fs = require('fs');
const path = require('path');

const isDirectory = (source) => new Promise((resolve, reject) => {
    try {
        fs.lstat(source, (err, stats) => {
            if (err) {
                throw err;
            }
            resolve(stats.isDirectory());
            return;
        })
    } catch (e) {
        reject(e)
    }
})

const trimExtension = (fileName) => {
    return fileName.replace(/\.[^/.]+$/, "");
}

const readDirectory = (source) => new Promise((resolve, reject) => {
    try {
        fs.readdir(source, (err, files) => {
            if (err) {
                throw err;
            }

            Promise.all(files.map(async (name) => {
                const isDir = await isDirectory(path.join(source, name));
                return {
                    name,
                    isDir
                }
            })).then(result => resolve(result));
        })
    } catch (e) {
        reject(e)
    }
});

const listFiles = async (source, filter) => {
    const items = await readDirectory(source);
    return items
        .filter(item => !item.isDir && filter.test(item.name))
        .map(item => trimExtension(item.name));
}

const readFile = (path) => new Promise((resolve, reject) => {
    try {
        fs.readFile(path, "utf8", function (err, data) {
            if (err) {
                throw err;
            }
            resolve(data);
        });
    } catch (e) {
        reject(e);
    }
})

const getTemplatesIds = async (source) => {
    const items = await readDirectory(source);
    return items
        .filter(item => item.isDir)
        .map(item => item.name);   
}

const isFileExistAndReadable = (path) => new Promise((resolve, reject) => {
    try {
        fs.access(path, fs.R_OK, (err) => {
            if (err) {
                resolve(false)
                return
            }

            resolve(true)
        })
    } catch (e) {
        reject(e);
    }
})

exports.getTemplates = async () => {
    const directories = await getTemplatesIds(path.join(__dirname, '..', '..', 'assets', 'templates'));
    return directories
}

exports.getTemplateById = async (templateName) => {
    const baseTemplatePath = path.resolve(__dirname, '..', '..', 'assets', 'templates', templateName);
    const templatePath = path.join(baseTemplatePath, 'index.handlebars');

    const isTemplateExist = await isFileExistAndReadable(templatePath);

    if (!isTemplateExist) {
        throw new Error(`Handlebars file for template ${templateName} is not found. Checked path: ${templatePath}`)
    }

    return {
        path: templatePath,
        basePath: baseTemplatePath
    }
}

exports.isTemplateExist = async (templateName) => {
    const baseTemplatePath = path.resolve(__dirname, '..', '..', 'assets', 'templates', templateName);
    const templatePath = path.join(baseTemplatePath, 'index.handlebars');

    return await isFileExistAndReadable(templatePath);
}

exports.getDummyUsers = async () => {
    const basePath = path.resolve(__dirname, '..', '..', 'assets', 'dummyUsers');
    return await listFiles(basePath, /\.json$/);
}

exports.isDummyUserExist = async (id) => {
    const basePath = path.resolve(__dirname, '..', '..', 'assets', 'dummyUsers');
    const userFile = path.join(basePath, `${id}.json`);

    return await isFileExistAndReadable(userFile);
}

exports.getDummyUserById = async (id) => {
    const basePath = path.resolve(__dirname, '..', '..', 'assets', 'dummyUsers');
    const userFile = path.join(basePath, `${id}.json`);

    const isUserExist = await isFileExistAndReadable(userFile);

    if (!isUserExist) {
        throw new Error(`JSON template file for dummyUser ${id} is not found. Checked path: ${userFile}`)
    }

    const rawUserData = await readFile(userFile);
    let userJson = {};

    try {
        userJson = JSON.parse(rawUserData);
    } catch (err) {
        console.error(err);
        throw new Error(`Failed to parse JSON template for ${id}. Template file: ${userFile}`);
    }

    return userJson;
}