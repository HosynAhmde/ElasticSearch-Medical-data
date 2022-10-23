const { Client } = require("@elastic/elasticsearch");
const elasticClient = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "4NL2c*ELW=nm4MIkJF2U",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports = { elasticClient };
