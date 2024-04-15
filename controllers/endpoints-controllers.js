const endpoints = require("../endpoints.json");

function getEndpoints(request, response, next) {
  response.status(200).send({endpoints});
}

module.exports = {getEndpoints};
