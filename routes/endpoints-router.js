const endpointRouter = require("express").Router();
const {getEndpoints} = require("../controllers/endpoints-controllers");

endpointRouter.get("/", getEndpoints);

module.exports = endpointRouter;
