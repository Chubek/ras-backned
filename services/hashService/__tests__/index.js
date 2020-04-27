/*
 * Created on Wed Feb 12 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const { getResumeHash } = require('../index')

test('Resume Hash Is The Same For The Same Resumes', () => {
    const hash1 = getResumeHash('template1', {fName: 'Homer', lName: 'Simpson'});
    const hash2 = getResumeHash('template1', {lName: 'Simpson', fName: 'Homer'});

    expect(hash1).toBeDefined();
    expect(hash2).toBeDefined();
    expect(hash1).toEqual(hash2);
    expect(hash1).toEqual(expect.stringContaining('template1-'));       
});

test('Resume Hash Is Different For The Different Resumes', () => {
    const hash1 = getResumeHash('template1', {name: 'Homer'});
    const hash2 = getResumeHash('template1', {name: 'Liza'});

    expect(hash1).toBeDefined();
    expect(hash2).toBeDefined();
    expect(hash1).not.toEqual(hash2);
    expect(hash1).toEqual(expect.stringContaining('template1-'));       
    expect(hash2).toEqual(expect.stringContaining('template1-'));       
});