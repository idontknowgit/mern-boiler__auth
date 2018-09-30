const inProduction = process.env.NODE_ENV === "production";
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".", ".env")
});

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 5000;

require("./models");

if (!inProduction) {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());

app.use(require("./routes"));
app.use(require("./controllers/error"));

if (inProduction) {
  app.use(express.static(path.join(__dirname, "..", "client", "build")));
  app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

app.listen(PORT, () => console.log("server running on port", PORT));

module.exports = { app };
