const express = require("express");
const {
  createIndex,
  getindices,
  removeindex,
  searchAllArticles,
  searchByRegex,
} = require("../controller/indices.controller");

const indicesRouter = express.Router();

// indicesRouter.post("/create", indices.);
indicesRouter.post("/create", createIndex);

indicesRouter.get("/list", getindices);
indicesRouter.get("/search-by-regex", searchByRegex);

indicesRouter.delete("/delete/:indexName", removeindex);

indicesRouter.get("/search", searchAllArticles);

module.exports = { indicesRouter };
