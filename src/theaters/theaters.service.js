const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//MIDDLEWARE FUNCTIONS
//Uses premade function in util to reduce movies so they aren't duplicated
const reduceMovies = reduceProperties("theater_id", {
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  rating: ["movies", null, "rating"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

//CRUDL FUNCTIONS
function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("t.*", "m.*")
    .then(reduceMovies);
}

function listTheatersPlayingMovie(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select("t.*", "m.*")
    .where({ "mt.movie_id": movieId });
}

module.exports = {
  list,
  listTheatersPlayingMovie,
};
