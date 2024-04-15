const db = require("../db/connection");

function selectCommentsByArticleId(article_id) {
  return db
    .query(
      `
    SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, articles.article_id FROM comments
    LEFT JOIN articles ON comments.article_id = articles.article_id
    WHERE comments.article_id = $1
    ORDER BY comments.created_at DESC;
    `,
      [article_id]
    )
    .then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows;
    });
}

module.exports = {selectCommentsByArticleId};
