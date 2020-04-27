/*
 * Created on Fri Feb 14 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const { validateRequestWithUserData, validateRequestWithDummyUser } = require('../validator');

test('Request Without TemplateId is failing', async () => {
    const request = {
        body: {},
        params: {
            templateId: undefined
        }
    };

    const validationResult = await validateRequestWithUserData(request);

    expect(validationResult).toBeDefined();
    expect(validationResult.status).toEqual(400);
    expect(validationResult.message).toEqual('templateId param is not found');
});

test('Request With Wrong TemplateId is failing', async () => {
    const request = {
        body: {},
        params: {
            templateId: 'some-template'
        }
    };

    const validationResult = await validateRequestWithUserData(request);

    expect(validationResult).toBeDefined();
    expect(validationResult.status).toEqual(400);
    expect(validationResult.message).toEqual('Template with id \"some-template\" is not found');
});

test('Request Without UserData is failing', async () => {
    const request = {
        body: {
            userData: undefined
        },
        params: {
            templateId: 'template1'
        }
    };

    const validationResult = await validateRequestWithUserData(request);

    expect(validationResult).toBeDefined();
    expect(validationResult.status).toEqual(400);
    expect(validationResult.message).toEqual('\"userData\" field is not found in request body');
});

test('Request With UserData is passing', async () => {
    const request = {
        body: {
            userData: {}
        },
        params: {
            templateId: 'template1'
        }
    };

    const validationResult = await validateRequestWithUserData(request);

    expect(validationResult).toEqual(null);
});

test('Request Without DummyUserId is failing', async () => {
    const request = {
        body: {
            userData: {}
        },
        params: {
            templateId: 'template1'
        }
    };

    const validationResult = await validateRequestWithDummyUser(request);

    expect(validationResult).toBeDefined();
    expect(validationResult.status).toEqual(400);
    expect(validationResult.message).toEqual('dummyUserId param is not found');
});

test('Request With Wrong DummyUserId is failing', async () => {
    const request = {
        body: {
            userData: {}
        },
        params: {
            templateId: 'template1',
            dummyUserId: 'unknown'
        }
    };

    const validationResult = await validateRequestWithDummyUser(request);

    expect(validationResult).toBeDefined();
    expect(validationResult.status).toEqual(400);
    expect(validationResult.message).toEqual('DummyUser with id unknown is not found');
});

test('Request With DummyUserId is passing', async () => {
    const request = {
        body: {
            userData: {}
        },
        params: {
            templateId: 'template1',
            dummyUserId: 'john'
        }
    };

    const validationResult = await validateRequestWithDummyUser(request);

    expect(validationResult).toEqual(null); 
});
