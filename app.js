const express = require("express");
const apiRouter = require("./routes/api-router");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.get("*", (request, response, next) => {
  response.status(404).send({msg: "Not found"});
});

app.use((error, request, response, next) => {
  if (error.status) {
    response.status(error.status).send({msg: error.msg});
  } else next(error);
});

app.use((error, request, response, next) => {
  if (error.code === "22P02") {
    response.status(400).send({msg: "Bad request"});
  } else next(error);
});

app.use((error, request, response, next) => {
  if (error.code === "23503") {
    response.status(404).send({msg: "Not found"});
  } else next(error);
});

module.exports = app;
