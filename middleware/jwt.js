const jwt = require("json-web-token");

const validate = (req, res, next) => {
  console.log(req.headers.authorization);
  if (!req.headers.authorization)
    return res.status(403).json({ code: 403, message: "Unauthorized" });

  try {
    var token = req.headers.authorization.split(" ")[1];
    token = token.substring(1, token.length - 1);

    const data = jwt.decode(process.env.JWT_KEY, token, (err, data) => {
      if (err) return null;

      return data;
    });

    if (!data) {
      return res.status(403).json({ code: 403, message: "Unauthorized" });
    }

    return next();
  } catch {
    return res.status(403).json({ code: 403, message: "Unauthorized" });
  }
};

const generateToken = async (user) => {
  const token = jwt.encode(process.env.JWT_KEY, user, "HS256", (err, token) => {
    console.log({ err, token });
    if (err) return null;
    return token;
  });

  return token;
};

module.exports = {
  validate,
  generateToken,
};
