const jwt = require("jsonwebtoken");

const UNAUTHORIZED = 401;

const handleAuthError = (err, res) => {
  res.status(UNAUTHORIZED).send({ message: "Authorization Error" });
}

const extractBearerToken = (req) => {
  const header = req.headers.authorization;
  return header.replace("Bearer ", "");
}

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return handleAuthError(err, res);
  }

  req.user = payload;
  next();
}
