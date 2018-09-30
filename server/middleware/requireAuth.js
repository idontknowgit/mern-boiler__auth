const jwt = require("jsonwebtoken");
const User = require("mongoose").model("User");

module.exports = async (req, res, next) => {
  const error = { statusCode: 401, messsage: "Unauthorized. Please log in." };
  try {
    const { id } = jwt.verify(getTokenFromHeader(req), process.env.JWT_SECRET);
    const user = await User.findById(id);

    if (!user) {
      return next(error);
    }

    res.locals.user = user;
    next();
  } catch (err) {
    next(error);
  }
};

const getTokenFromHeader = req => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader) {
    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return null;
    }

    return token;
  }

  return null;
};
