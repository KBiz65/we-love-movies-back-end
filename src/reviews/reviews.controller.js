const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//MIDDLEWARE FUNCTIONS
//Checks to make sure the reviewId is for a valid review
async function reviewExists(req, res, next) {
  const reviewId = Number(req.params.reviewId);
  const review = await service.read(reviewId);

  if (review) {
    res.locals.reviewId = reviewId;
    res.locals.review = review;
    return next();
  }
  next({ status: 404, message: `Review cannot be found.` });
}

//Verifies there is a score or content property in the data
async function bodyHasValidProperties(req, res, next) {
  const { data: { score, content } = {} } = req.body;
  const updatedReview = {};

  if (!score && !content) {
    return next({
      status: 404,
      message: `Must have 'score' or 'content' property.`,
    });
  }

  if (score) {
    updatedReview.score = score;
  }

  if (content) {
    updatedReview.content = content;
  }

  res.locals.updatedReview = updatedReview;
  return next();
}

//CRUDL FUNCTIONS
async function read(req, res) {
  const reviewId = res.locals.reviewId;

  const data = await service.read(reviewId);
  res.json({ data });
}

async function update(req, res, next) {
  const reviewId = res.locals.reviewId;

  //does the actual update of the review record
  await service.update(reviewId, res.locals.updatedReview);
  //once review is updated it sets data to the updated review
  const data = await service.read(reviewId);
  //adds the required critic object into review to be returned
  const updatedReviewWithCritics = await service.updateAddCritics(data);

  res.json({ data: updatedReviewWithCritics });
}

async function destroy(req, res) {
  const reviewId = res.locals.reviewId;
  await service.delete(reviewId);

  res.sendStatus(204);
}

async function list(req, res) {
  const movieId = Number(req.params.movieId);

  if (movieId) {
    const data = await service.listWithReviews(movieId);
    res.json({ data: data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

module.exports = {
  read: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(bodyHasValidProperties),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  list: asyncErrorBoundary(list),
  listWithReviews: asyncErrorBoundary(list),
  updateAddCritics: asyncErrorBoundary(update),
};
