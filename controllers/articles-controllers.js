const {
  selectArticleById,
  selectArticles,
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
  selectArticles().then((articles) => {
    response.status(200).send({articles});
  });
}

module.exports = {getArticleById, getArticles};
