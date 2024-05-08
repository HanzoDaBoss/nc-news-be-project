const db = require("../db/connection");

function selectArticleById(article_id) {
  return db
    .query(
      `
    SELECT articles.author, title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, article_img_url,
    CAST(COUNT(comments.article_id) AS int) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
}

function selectArticles(topic, sort_by = "created_at", order = "DESC") {
  if (
    ![
      "author",
      "title",
      "topic",
      "created_at",
      "votes",
      "comment_count",
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  const orderBy = order.toUpperCase();
  if (!["DESC", "ASC"].includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  const queryVals = [];
  let sqlQueryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  CAST(COUNT(comments.article_id) AS int)
  AS comment_count FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    sqlQueryString += `WHERE topic=$1 `;
    queryVals.push(topic);
  }

  if (sort_by === "comment_count") {
    sqlQueryString += `
    GROUP BY articles.article_id
    ORDER BY CAST(COUNT(comments.article_id) AS int) ${orderBy};
    `;
  } else {
    sqlQueryString += `
    GROUP BY articles.article_id
    ORDER BY articles.${sort_by} ${orderBy};
    `;
  }

  return db.query(sqlQueryString, queryVals).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return rows;
  });
}

function updateArticleById(article_id, { inc_votes }) {
  const updateVals = [inc_votes, article_id];

  if (updateVals.includes(undefined)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
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
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return rows[0];
    });
}

function insertArticle({ author, title, body, topic, article_img_url }) {
  const insertVals = [author, title, body, topic];
  if (insertVals.includes(undefined)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(
      `
  INSERT INTO articles (author, title, body, topic, article_img_url)
  VALUES
  ($1, $2, $3, $4, COALESCE($5, 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'));
  `,
      [...insertVals, article_img_url]
    )
    .then(() => {
      return db.query(`
      SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
      CAST(COUNT(comments.article_id) AS int)
      AS comment_count FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.article_id DESC
      LIMIT 1;
      `);
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  selectArticleById,
  selectArticles,
  updateArticleById,
  insertArticle,
};
