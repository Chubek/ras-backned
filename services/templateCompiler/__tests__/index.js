/*
 * Created on Tue Feb 11 2020
 *
 * Copyright (c) 2020 Ilia Pirozhenko <ilia@ipirozhenko.com>
 */

const { readAndCompileTemplate } = require('../index');
const path = require('path');

test('Template Compiled Sucessfully', async () => {
    const templatePath = path.join(__dirname, 'template.handlebars');
    const result = await readAndCompileTemplate(templatePath, { name: 'Homer' });   
    expect(result).toBe('<div>Homer</div>');
});