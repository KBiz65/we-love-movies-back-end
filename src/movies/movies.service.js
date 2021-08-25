const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

//MIDDLEWARE FUNCTIONS
//Uses premade function in utils to avoid movies being duplicated on screen
const reduceMovies = reduceProperties("movie_id", {
  movie_id: ["movie_id"],
  title: ["title"],
  rating: ["rating"],
  runtime_in_minutes: ["runtime_in_minutes"],
  description: ["description"],
  image_url: ["image_url"],
});

//CRUDL FUNCTIONS
function read(movieId) {
  return knex("movies as m")
    .select("*")
    .where({ "m.movie_id": movieId })
    .first();
}

function list(is_showing = false) {
  if (is_showing) {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .select("m.*")
      .where({ "mt.is_showing": true })
      .then(reduceMovies);
  } else {
    return knex("movies").select("*");
  }
}

module.exports = {
  list,
  read,
};
