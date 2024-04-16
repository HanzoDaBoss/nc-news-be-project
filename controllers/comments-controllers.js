const {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
} = require("../models/comments-models");

function getCommentsByArticleId(request, response, next) {
  const {article_id} = request.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      response.status(200).send({comments});
    })
    .catch(next);
}

function postCommentByArticleId(request, response, next) {
  const {article_id} = request.params;
  const {body} = request;
  insertCommentByArticleId(article_id, body)
    .then((comment) => {
      response.status(201).send({comment});
    })
    .catch(next);
}

function deleteCommentById(request, response, next) {
  const {comment_id} = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch(next);
}

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
};
