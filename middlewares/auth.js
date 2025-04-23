const UNAUTHORIZED = 401;

payload = jwt.verify(token, JWT_SECRET);


const authMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
    }

    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload;
    next();
  } catch (err) {
    res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }
};

app.use((req, res, next) => {
  req.user = payload;
  next();
});

module.exports = authMiddleware;