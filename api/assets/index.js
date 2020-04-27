/*
 * Created on Wed Feb 12 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const express = require('express');
const { silentErrorHandler, notFoundHandler } = require('../helpers');
const { getTemplates, getDummyUsers } = require('../../services/assetsRepository');

const app = express();

app.get('/templates', (req, res) => {
    getTemplates()
        .then(templates => {
            res.status(200).json({ templates })
        })
        .catch(err => {
            console.err(err);
            res.sendStatus(500);
        })
});

app.get('/dummy-users', (req, res) => {
    getDummyUsers()
        .then(users => {
            res.status(200).json({ users })
        })
        .catch(err => {
            console.err(err);
            res.sendStatus(500);
        })
});

app.use('*', notFoundHandler);
app.use(silentErrorHandler);

module.exports = app;