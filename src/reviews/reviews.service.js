const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");

//MIDDLEWARE FUNCTIONS
//Uses premade function in util to add nested critic object
const addCritics = mapProperties({
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
});

//CRUDL FUNCTIONS
async function read(reviewId) {
  return knex("reviews as r")
    .select("*")
    .where({ "r.review_id": reviewId })
    .first();
}

async function update(reviewId, updatedReview) {
  return knex("reviews as r")
    .where({ "r.review_id": reviewId })
    .update(updatedReview);
}

async function updateAddCritics(review) {
  return knex("reviews as r")
    .select("*")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .where({ "r.review_id": review.review_id })
    .first()
    .then(addCritics);
}

async function destroy(reviewId) {
  return knex("reviews as r").where({ "r.review_id": reviewId }).del();
}

async function list() {
  return knex("reviews as r").select("*");
}

async function listWithReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("r.*", "c.*")
    .where({ "r.movie_id": movieId })
    .then((data) => {
      return data.map((item) => {
        return addCritics(item);
      });
    });
}

module.exports = {
  read,
  update,
  delete: destroy,
  list,
  listWithReviews,
  updateAddCritics,
};
