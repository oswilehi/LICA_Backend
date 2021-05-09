let chai = require("chai");
let chaiHttp = require("chai-http");
const sinon = require("sinon");
const auth = require("../middleware/jwt");

chai.should();

chai.use(chaiHttp);

describe("Watched routes test", () => {
  sinon.stub(auth, "validate").callsFake(async (req, res, next) => next());

  let server = require("../app");

  describe("GET /watched/:user", () => {
    it("Should return the watched list of a user", () => {
      chai
        .request(server)
        .get("/watched/test@test.com")
        .end((err, response) => {
          response.should.have.status(200);
        });
    });
  });
  describe("DELETE /watched/:id", () => {
    it("Should delete movie from watched list of user", () => {
      chai
        .request(server)
        .delete("/watched/123test")
        .end((err, response) => {
          response.should.have.status(200);
        });
    });
  });
  describe("PUT /watched/:id/:user", () => {
    it("Should move movie to watch list of user", () => {
      chai
        .request(server)
        .put("/watched/123test/test@test.com")
        .end((err, response) => {
          response.should.have.status(200);
        });
    });
  });
  auth.validate.restore();
});
