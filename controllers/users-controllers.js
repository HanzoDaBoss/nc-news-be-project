const {selectUsers} = require("../models/users-models");

function getUsers(request, response, next) {
  selectUsers().then((users) => {
    response.status(200).send({users});
  });
}

module.exports = {getUsers};
