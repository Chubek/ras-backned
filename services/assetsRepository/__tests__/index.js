/*
 * Created on Wed Feb 12 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const path = require('path');
const {
    getTemplates,
    getTemplateById,
    isTemplateExist,
    getDummyUsers,
    isDummyUserExist,
    getDummyUserById } = require('../index');

test('GetTemplatesNames Working', async () => {
    const templates = await getTemplates();

    expect(templates).toBeDefined();
    expect(templates.length).toBeGreaterThan(0);
});

test('Get Template By Name Return Correct Template', async () => {
    const template = await getTemplateById('template1');

    expect(template).toBeDefined();
    expect(template.basePath).toBeDefined();
    expect(template.basePath).toEqual(expect.stringContaining(path.join('templates', 'template1')));
    expect(template.path).toBeDefined();
    expect(template.path).toEqual(expect.stringContaining(path.join('templates', 'template1', 'index.handlebars')));
});

test('Get Not Exist Template By Name Throws an Error', async () => {
    try {
        await getTemplateById('some_template');
    } catch (err) {
        expect(err.message).toEqual(expect.stringContaining('Handlebars file for template some_template is not found'));
    }
});

test('IsTemplateExist working for existing template', async () => {
    const res = await isTemplateExist('template1');
    expect(res).toBe(true);
});

test('IsTemplateExist working for not existing template', async () => {
    const res = await isTemplateExist('some_template');
    expect(res).toBe(false);
});

test('GetDummyUsers is working', async () => {
    const res = await getDummyUsers();
    expect(res).toBeDefined();
    expect(res.length).toBeGreaterThan(0);
});

test('GetDummyUserById is working for existing user', async () => {
    const res = await getDummyUserById('john');
    expect(res).toBeDefined();
    expect(res.name).toEqual('John');
});

test('GetDummyUserById is working for not existing user', async () => {
    try {
        await getDummyUserById('homer');
    } catch (err) {
        expect(err.message).toEqual(expect.stringContaining('JSON template file for dummyUser homer is not found'));
    }
});

test('IsDummyUserExist is working for existing user', async () => {
    const res = await isDummyUserExist('john');
    expect(res).toBe(true);
});

test('IsDummyUserExist is working for not existing user', async () => {
    const res = await isDummyUserExist('homer');
    expect(res).toBe(false);
});
