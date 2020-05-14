/*
 * Created on Tue Feb 11 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

"use strict";
const render = require("./api/render");
const assets = require("./api/assets");
const app = require("./server");
const colors = require("colors");

const port = 8000;

app.listen(port, () =>
  console.error(`Server started on port ${port}`.blue.inverse)
);

exports.render = render;
exports.assets = assets;
