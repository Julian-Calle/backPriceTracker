const express = require("express");
const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");
const swaggerDoc = yamljs.load("./swagger.yaml");

const swaggerDocumentation = express.Router();

swaggerDocumentation.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
// swaggerDocumentation.use("/docs", swaggerUI.serve, swaggerUI.setup());
// swaggerDocumentation.use("/docs", (_, res) => {
//   res.send(swaggerUI.generateHTML(swaggerDoc));
// });

module.exports = swaggerDocumentation;
