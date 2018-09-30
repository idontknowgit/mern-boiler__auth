const User = require("mongoose").model("User");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await new User({ email, password }).save();

    res.json({ payload: user.toAuthJSON() });
  } catch (err) {
    if (err.code == 11000) {
      return next({
        statusCode: 403,
        message: "This email is already linked to an existing account."
      });
    }

    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const error = { statusCode: 401, message: "Invalid password or email." };

    if (!email || !password) {
      return next(error);
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.isCorrectPassword(password))) {
      return next(error);
    }

    res.json({ payload: user.toAuthJSON() });
  } catch (err) {
    next(err);
  }
};

exports.refreshSession = async (req, res, next) => {
  try {
    res.json({ payload: res.locals.user.toAuthJSON() });
  } catch (err) {
    next(err);
  }
};
