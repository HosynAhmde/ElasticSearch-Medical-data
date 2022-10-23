const { parse } = require("csv-parse");
const fs = require("fs");
const { elasticClient } = require("../config/elastic.config");

const articles = [];
const indexName = "gastric";
fs.createReadStream("data5 copy.csv")
  .pipe(
    parse({
      columns: [
        "PMID",
        "Title",
        "Authors",
        "AuthorsFullName",
        "AuthorsAffiliation",
        "JournalTitleAbbreviation",
        "JournalTitle",
        "ISSN",
        "PlaceofPublication",
        "Abstract",
        "keywords",
        "MeSHTerms",
        "Date",
        "ArticleIdentifier",
      ],
      delimiter: ["\t"],
      ignore_last_delimiters: true,
      trim: true,
      skip_empty_lines: true,
    })
  )
  .on("data", (data) => {
    articles.push(data);
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    console.log(articles.length);
  });

async function createIndex(req, res, next) {
  try {
    let data = [];
    data = articles;
    await elasticClient.indices.create(
      {
        index: indexName,
        operations: {
          mappings: {
            properties: {
              PMID: { type: "integer" },
              Title: { type: "text" },
              Authors: { type: "text" },
              AuthorsFullName: { type: "text" },
              AuthorsAffiliation: { type: "text" },
              JournalTitleAbbreviation: { type: "text" },
              JournalTitle: { type: "text" },
              ISSN: { type: "text" },
              Abstract: { type: "text" },
              keywords: { type: "text" },
              Date: { type: "text" },
              ArticleIdentifier: { type: "text" },
              null: { type: "text" },
            },
          },
        },
      },
      { ignore: [400] }
    );

    const operations = data.flatMap((doc) => [
      { index: { _index: indexName } },
      doc,
    ]);

    const bulkResponse = await elasticClient.bulk({
      refresh: true,
      operations,
    });

    const count = await elasticClient.count({ index: indexName });
    // console.log(count);

    return res.json(bulkResponse);
  } catch (error) {
    next(error);
  }
}

async function getindices(req, res, next) {
  try {
    const indices = await elasticClient.search({ index: indexName });
    return res.json(indices.hits.hits);
  } catch (error) {
    next(error);
  }
}

async function removeindex(req, res, next) {
  try {
    const { indexName } = req.params;
    const remove = await elasticClient.indices.delete({ index: indexName });
    return res.json({
      remove,
    });
  } catch (error) {
    next(error);
  }
}

async function searchAllArticles(req, res, next) {
  try {
    const { value } = req.query;
    const articles = await elasticClient.search({
      index: indexName,
      query: value,
    });
    return res.json(articles.hits.hits);
  } catch (error) {
    next(error);
  }
}

async function searchByRegex(req, res, next) {
  try {
    const { search } = req.query;
    // search = search.toLowercase();
    const articles = await elasticClient.search({
      index: indexName,
      query: {
        regexp: {
          PMID: `.*${search}.*`,
        },
      },
    });

    return res.json(articles.hits.hits);
  } catch (error) {
    next(error);
  }
}
module.exports = {
  createIndex,
  getindices,
  removeindex,
  searchAllArticles,
  searchByRegex,
};
