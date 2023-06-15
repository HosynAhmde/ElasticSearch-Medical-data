const { Client } = require("@elastic/elasticsearch");
const elasticClient = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "0-V7W_gLak7QagBkaCiK",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports = { elasticClient };
