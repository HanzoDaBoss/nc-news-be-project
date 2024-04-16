const db = require("../db/connection");

function selectArticleById(article_id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
}

function selectArticles(topic) {
  const queryVals = [];
  let sqlQueryString = `
  SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) 
  AS comment_count FROM articles
  FULL OUTER JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    sqlQueryString += `WHERE topic=$1 `;
    queryVals.push(topic);
  }

  sqlQueryString += `
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC;
  `;

  return db.query(sqlQueryString, queryVals).then(({rows}) => {
    console.log(rows);
    if (rows.length === 0) {
      return Promise.reject({status: 404, msg: "Not found"});
    }
    return rows;
  });
}

function updateArticleById(article_id, {inc_votes}) {
  const updateVals = [inc_votes, article_id];

  if (updateVals.includes(undefined)) {
    return Promise.reject({status: 400, msg: "Bad request"});
  }

  return db
    .query(
      `
  UPDATE articles SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;
  `,
      updateVals
    )
    .then(({rows}) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
}

module.exports = {selectArticleById, selectArticles, updateArticleById};
