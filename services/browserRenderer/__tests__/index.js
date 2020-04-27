/*
 * Created on Tue Feb 11 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const { renderPage, renderPageToPng } = require('../index');
const path = require('path');

const DUMMY_PAGE_HTML = '<html><head></head><body><div>test</div></body></html>'
const DUMMY_PAGE_WITH_EXTERNAL_CSS = '<html><head><link rel="stylesheet" type="text/css" href="app.css"></head><body><div>test</div></body></html>'

test('Browser Renders Dummy Page', async () => {
    const basePath = `file:${path.join(__dirname)}`;
    await renderPage(DUMMY_PAGE_HTML, basePath, async (page) => {
        const content = await page.content()
        expect(content).toBe(DUMMY_PAGE_HTML)
    });
});

test('Browser Renders Dummy Page And Link CSS via basePath', async () => {
    const basePath = `file:${path.join(__dirname)}`;
    await renderPage(DUMMY_PAGE_WITH_EXTERNAL_CSS, basePath, async (page) => {
        const result = await page.$eval('div', (elem) => {
            return window.getComputedStyle(elem).getPropertyValue('color');
        });
        expect(result).toBe('rgb(255, 0, 0)');
    });
});

test('Browser Renders Dummy Page To Png', async () => {
    const basePath = `file:${path.join(__dirname)}`;
    const result = await renderPageToPng(DUMMY_PAGE_HTML, basePath );

    expect(result).toBeDefined();
});
