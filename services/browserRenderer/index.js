/*
 * Created on Tue Feb 11 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const puppeteer = require('puppeteer');

const DEFAULT_OPTIONS = {
    fullPage: false,
    width: 800,
    height: 300
}

exports.renderPage = async (htmlContent, basePath, callback, options) => {
    const opt = { ...DEFAULT_OPTIONS, ...options };
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({
        width: opt.width,
        height: opt.height,
        deviceScaleFactor: 1,
    });

    await page.goto(basePath);
    await page.setContent(htmlContent);

    await callback(page);

    await browser.close();
}

exports.renderPageToPng = (htmlContent, basePath, options) => {
    const opt = { ...DEFAULT_OPTIONS, ...options };
    return new Promise(async (resolve, reject) => {
        try {
            await this.renderPage(htmlContent, basePath, async (page) => {
                const screenshot = await page.screenshot({ fullPage: opt.fullPage });
                resolve(screenshot);
            }, options)
        } catch (e) {
            reject(e);
        }
    })
}