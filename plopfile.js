module.exports = function (plop) {
  plop.setGenerator("server-index", {
    description: "Creates server index",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Name of your index file.",
        validate: (v) => {
          const noDigits = /[a-z]+/;
          if (noDigits.test(v)) {
            return true;
          }
          return "Only lowercase letters are allowed.";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "./{{name}}.js",
        templateFile: "plop-templates/ServerIndexTemplate.hbs",
        abortOnFail: true,
      },
    ],
  });

  plop.setGenerator("backend-module", {
    description:
      "Creates backend module, including route, module, and helpers.",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Name of your index file.",
        validate: (v) => {
          const noDigits = /[A-Z][a-zA-Z]+/;
          if (noDigits.test(v)) {
            return true;
          }
          return "Only letters are allowed. The name must be capitalized.";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "./Modules/{{name}}/Route/index.js",
        templateFile: "plop-templates/RouteTemplate.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: "./Modules/{{name}}/Model/index.js",
        templateFile: "plop-templates/ModelTemplate.hbs",
        abortOnFail: true,
      },
      {
        type: "add",
        path: "./Modules/{{name}}/Helpers/index.js",
        templateFile: "plop-templates/HelperTemplate.hbs",
        abortOnFail: true,
      },
      {
        type: "modify",
        path: "./Modules/{{name}}/Model/index.js",
        transform(fileContents, data) {
          return fileContents.replace(/Placeholder/g, data.name);
        },
      },
    ],
  });

  plop.setGenerator("backend-middleware", {
    description: "Creates a backend middleware",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "Name of your index file.",
        validate: (v) => {
          const noDigits = /[A-Z][a-zA-Z]+/;
          if (noDigits.test(v)) {
            return true;
          }
          return "Only letters are allowed. The name must be capitalized.";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "./Middleware/{{name}}.js",
        templateFile: "plop-templates/MiddlewareTemplate.hbs",
        abortOnFail: true,
      },
      {
        type: "modify",
        path: "./Middleware/{{name}}.js",
        transform(fileContents, data) {
          return fileContents.replace(/Placeholder/g, data.name);
        },
      },
    ],
  });

  plop.setGenerator("backend-mailer", {
    description: "Creates a mailer",
    prompts: [
      {
        type: "input",
        name: "email",
        message: "Name of your index file.",
        validate: (v) => {
          const emailValidator = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
          if (emailValidator.test(v)) {
            return true;
          }
          return "Invalid email.";
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "./Services/Mailer.js",
        templateFile: "plop-templates/MailerTemplate.hbs",
        abortOnFail: true,
      },
      {
        type: "modify",
        path: "./Services/Mailer.js",
        transform(fileContents, data) {
          return fileContents.replace(/Placeholder/g, data.email);
        },
      },
    ],
  });
};
