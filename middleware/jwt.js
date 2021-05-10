const { createRemoteJWKSet } = require("jose/jwks/remote");
const { jwtVerify } = require("jose/jwt/verify");

const validate = async (req, res, next) => {
  const JWKS = createRemoteJWKSet(new URL(process.env.COGNITO_URL));
  var token = req.headers.authorization;

  try {
    const { payload, protectedHeader } = await jwtVerify(token, JWKS, {
      token_use: "idToken",
      iss: process.env.COGNITO_ISS,
    });

    return next();
  } catch (e) {
    console.log(e.message);
    return res.status(403).json({ code: 403, message: "Unauthorized" });
  }
};

module.exports = { validate };
