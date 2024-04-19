const apiRouter = require("express").Router();
const endpointRouter = require("./endpoints-router");
const topicRouter = require("./topics-router");
const articleRouter = require("./articles-router");
const commentRouter = require("./comments-router");
const userRouter = require("./users-router");

apiRouter.use("/", endpointRouter);
apiRouter.use("/topics", topicRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
