const {selectUsers, selectUserByUsername} = require("../models/users-models");

function getUsers(request, response, next) {
  selectUsers().then((users) => {
    response.status(200).send({users});
  });
}

function getUserByUsername(request, response, next) {
  const {username} = request.params;
  selectUserByUsername(username)
    .then((user) => {
      response.status(200).send({user});
    })
    .catch(next);
}

module.exports = {getUsers, getUserByUsername};
