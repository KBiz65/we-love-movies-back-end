const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//MIDDLEWARE FUNCTIONS
//Checks to make sure the movieId is for a valid movie
async function movieExists(req, res, next) {
  const movieId = Number(req.params.movieId);
  const movie = await service.read(movieId);

  if (movie) {
    res.locals.movieId = movieId;
    return next();
  }
  next({ status: 404, message: `Movie cannot be found.` });
}

//CRUDL FUNCTIONS
async function read(req, res) {
  const data = await service.read(res.locals.movieId);
  res.json({ data });
}

async function list(req, res) {
  const { is_showing } = req.query;
  if (is_showing) {
    const data = await service.list(is_showing);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
};
