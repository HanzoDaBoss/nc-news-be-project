const express = require("express");
const {getTopics} = require("./controllers/topics-controllers");
const {getEndpoints} = require("./controllers/endpoints-controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles-controllers");
const {getCommentsByArticleId} = require("./controllers/comments-controllers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

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

module.exports = app;
