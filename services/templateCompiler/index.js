/*
 * Created on Tue Feb 11 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const fs = require('fs');
const Handlebars = require("handlebars")

const readTemplateFile = (path) => {
    return new Promise((resolve, reject) => {
        try {
            fs.readFile(
                path,
                { encoding: 'utf-8' },
                (err, data) => {
                    if (err) {
                        throw err;
                    }
                    resolve(data)
                });
        } catch (e) {
            return reject(e);
        }
    })
}

exports.readAndCompileTemplate = async (path, context) => {
    const htmlData = await readTemplateFile(path);
    const template = Handlebars.compile(htmlData);

    return template(context)
}
