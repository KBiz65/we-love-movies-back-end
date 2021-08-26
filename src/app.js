if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
const errorHandler = require("../src/errors/errorHandler");
const notFound = require("../src/errors/notFound");
const moviesRouter = require("../src/movies/movies.router");
const theatersRouter = require("../src/theaters/theaters.router");
const reviewsRouter = require("../src/reviews/reviews.router");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "Up and at em!",
  });
});
app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
