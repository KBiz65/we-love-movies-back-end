const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//CRUDL FUNCTIONS
async function list(req, res) {
  const movieId = Number(req.params.movieId);

  if (movieId) {
    const data = await service.listTheatersPlayingMovie(movieId);
    res.json({ data: data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

module.exports = {
  list: asyncErrorBoundary(list),
  listTheatersPlayingMovie: asyncErrorBoundary(list),
};
