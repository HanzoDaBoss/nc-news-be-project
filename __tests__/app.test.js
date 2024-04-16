const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("/api/invalid-endpoint", () => {
  test("GET 404: responds with status and error message when passed a invalid endpoint for any type of request", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("/api/topics", () => {
  test("GET 200: responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET 200: responds with an object describing all available endpoints on this API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({body}) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200: responds with an article object corresponding to the passed id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body}) => {
        const {article} = body;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("GET 404: responds with a status and error message if article id is not found in database", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("GET 400: responds with a status and error message if article id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("PATCH 200: responds with an updated article object corresponding to the passed article id", () => {
    return request(app)
      .patch("/api/articles/6")
      .send({
        inc_votes: 42,
      })
      .expect(200)
      .then(({body}) => {
        const {article} = body;
        expect(article).toHaveProperty("author", "icellusedkars");
        expect(article).toHaveProperty("title", "A");
        expect(article).toHaveProperty("article_id", 6);
        expect(article).toHaveProperty("body", "Delicious tin of cat food");
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes", 42);
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("PATCH 200: responds with an updated article object with subtracted votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: -40,
      })
      .expect(200)
      .then(({body}) => {
        const {article} = body;
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty(
          "title",
          "Living in the shadow of a great man"
        );
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty(
          "body",
          "I find this existence challenging"
        );
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes", 60);
        expect(article).toHaveProperty(
          "article_img_url",
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("PATCH 404: responds with a status and error message if article id is not found in database", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({
        inc_votes: 42,
      })
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("PATCH 400: responds with a status and error message if article id is invalid", () => {
    return request(app)
      .patch("/api/articles/invalid_id")
      .send({
        inc_votes: 42,
      })
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400: responds with status and error message if passed object is missing inc_votes", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({})
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200: responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({body}) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
        body.articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET 200: responds with an array of comments corresponding to the passed article id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({body}) => {
        const {comments} = body;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
          coerce: true,
        });
      });
  });
  test("GET 404: responds with a status and error message if article id is not found in database", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test("GET 404: responds with a status and error message if article id is valid but final pathname is invalid", () => {
    return request(app)
      .get("/api/articles/9/invalid-endpoint")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("GET 400: responds with a status and error message if article id is invalid", () => {
    return request(app)
      .get("/api/articles/invalid_id/comments")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("POST 201: responds with the posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "lurker",
        body: "Great supine protoplasmic invertebrate jellies",
      })
      .expect(201)
      .then(({body}) => {
        const {comment} = body;
        expect(comment).toHaveProperty("comment_id", 19);
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("author", "lurker");
        expect(comment).toHaveProperty(
          "body",
          "Great supine protoplasmic invertebrate jellies"
        );
        expect(comment).toHaveProperty("article_id", 2);
      });
  });
  test("POST 400: responds with status and error message if passed comment is missing required fields", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({
        username: "lurker",
      })
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("POST 404: responds with status and error message if article id is not found in database", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .send({
        username: "lurker",
        body: "Great supine protoplasmic invertebrate jellies",
      })
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204: deletes the comment corresponding to the comment id and responds with no content", () => {
    return request(app)
      .delete("/api/comments/3")
      .expect(204)
      .then(({body}) => {
        expect(body).toEqual({});
      });
  });
  test("DELETE 404: responds with a status and error message if comment id is not found in database", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
  test("DELETE 400: responds with a status and error message if comment id is invalid", () => {
    return request(app)
      .delete("/api/comments/invalid_id")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
