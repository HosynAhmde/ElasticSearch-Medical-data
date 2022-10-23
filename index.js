const express = require("express");
const app = express();
const path = require("path");
const { AllRoutes } = require("./router/router");
const server = require("http").createServer(app);
require("dotenv").config();

//Middlware Config

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use(AllRoutes);

app.use((req, res, next) => {
  return res.status(404).json({
    status: 404,
    message: "not found",
  });
});

//Error Handeling
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message,
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server run on port ${process.env.PORT}`);
});
