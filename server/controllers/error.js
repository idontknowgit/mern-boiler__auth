module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 422;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Oops, something went wrong.";

  if (process.env.NODE_ENV !== "production" && statusCode === 500) {
    console.log(err.stack);
  }

  res.status(statusCode).json({ error: { message, statusCode } });
};
