const {
  selectArticleById,
  selectArticles,
  updateArticleById,
} = require("../models/articles-models");

function getArticleById(request, response, next) {
  const {article_id} = request.params;
  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({article});
    })
    .catch(next);
}

function getArticles(request, response, next) {
  const {topic} = request.query;
  selectArticles(topic)
    .then((articles) => {
      response.status(200).send({articles});
    })
    .catch(next);
}

function patchArticleById(request, response, next) {
  const {article_id} = request.params;
  const {body} = request;
  updateArticleById(article_id, body)
    .then((article) => {
      response.status(200).send({article});
    })
    .catch(next);
}

module.exports = {getArticleById, getArticles, patchArticleById};
