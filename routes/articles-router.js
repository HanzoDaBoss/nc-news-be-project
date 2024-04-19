const articleRouter = require("express").Router();
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("../controllers/articles-controllers");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments-controllers");

articleRouter.route("/").get(getArticles);

articleRouter.route("/:article_id").get(getArticleById).patch(patchArticleById);

articleRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articleRouter;
