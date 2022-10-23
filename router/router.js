const { indicesRouter } = require("./indices.routes");

const AllRoutes = require("express").Router();

AllRoutes.use("/indices", indicesRouter);

module.exports = { AllRoutes };
