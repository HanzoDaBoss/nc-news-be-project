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
