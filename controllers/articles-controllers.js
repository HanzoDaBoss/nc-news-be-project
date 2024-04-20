const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
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
  const {topic, sort_by, order} = request.query;
  selectArticles(topic, sort_by, order)
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

function postArticle(request, response, next) {
  const {body} = request;
  insertArticle(body)
    .then((article) => {
      response.status(201).send({article});
    })
    .catch(next);
}

module.exports = {getArticleById, getArticles, patchArticleById, postArticle};
