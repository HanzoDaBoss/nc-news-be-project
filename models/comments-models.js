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

function insertCommentByArticleId(article_id, {username, body}) {
  const insertVals = [username, body, article_id];

  if (insertVals.includes(undefined)) {
    return Promise.reject({status: 400, msg: "Bad request"});
  }

  return db
    .query(
      `
  INSERT INTO comments (votes, author, body, article_id)
  VALUES
  (0, $1, $2, $3)
  RETURNING *;
  `,
      insertVals
    )
    .then(({rows}) => {
      return rows[0];
    });
}

function removeCommentById(comment_id) {
  return db
    .query(
      `
  DELETE FROM comments WHERE comment_id = $1
  RETURNING *;
  `,
      [comment_id]
    )
    .then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
    });
}

function updateCommentById(comment_id, {inc_votes}) {
  const updateVals = [inc_votes, comment_id];

  if (updateVals.includes(undefined)) {
    return Promise.reject({status: 400, msg: "Bad request"});
  }

  return db
    .query(
      `
  UPDATE comments SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;
  `,
      updateVals
    )
    .then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      return rows[0];
    });
}

module.exports = {
  selectCommentsByArticleId,
  insertCommentByArticleId,
  removeCommentById,
  updateCommentById,
};
