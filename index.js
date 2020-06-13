/*
 * Created on Tue Feb 11 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

"use strict";
require("dotenv").config();
const render = require("./api/render");
const assets = require("./api/assets");
const app = require("./server/server-dev");

exports.render = render;
exports.assets = assets;
exports.app = app;
