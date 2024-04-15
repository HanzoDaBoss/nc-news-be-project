const db = require("../db/connection");

function selectTopics() {
  return db.query(`SELECT * FROM topics;`).then(({rows}) => {
    console.log(rows);
    return rows;
  });
}

module.exports = {selectTopics};
