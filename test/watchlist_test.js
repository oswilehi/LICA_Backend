let chai = require("chai");
let chaiHttp = require("chai-http");
const sinon = require("sinon");
const auth = require("../middleware/jwt");

chai.should();

chai.use(chaiHttp);

describe("Watch list routes test", () => {
  sinon.stub(auth, "validate").callsFake(async (req, res, next) => next());

  let server = require("../app");

  describe("GET /watchlist/:user", () => {
    it("Should return the watch list of a user", () => {
      chai
        .request(server)
        .get("/watchlist/test@test.com")
        .end((err, response) => {
          response.should.have.status(200);
        });
    });
  });
  describe("GET /watchlist/:id/:user", () => {
    it("Should return the movie from watch list of a user", () => {
      chai
        .request(server)
        .get("/watchlist/123test/test@test.com")
        .end((err, response) => {
          response.should.have.status(200);
        });
    });
  });
  describe("POST /watchlist/", () => {
    it("Should insert a new movie to watch list of user", () => {
      const record = {
        id: "123test",

        image: "/test.jpg",

        user: "test@test.com",
      };
      chai
        .request(server)
        .post("/watchlist/")
        .send(record)
        .end((err, response) => {
          response.should.have.status(200);
        });
    });
  });
  describe("DELETE /watchlist/:id", () => {
    it("Should delete movie from watch list of user", () => {
      chai
        .request(server)
        .delete("/watchlist/123test")
        .end((err, response) => {
          response.should.have.status(200);
        });
    });
  });
  describe("PUT /watchlist/:id/:user", () => {
    it("Should move movie to watched list of user", () => {
      chai
        .request(server)
        .put("/watchlist/123test/test@test.com")
        .end((err, response) => {
          response.should.have.status(200);
        });
    });
  });
  auth.validate.restore();
});
