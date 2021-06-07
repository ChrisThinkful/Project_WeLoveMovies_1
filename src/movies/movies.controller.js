const service = require('./movies.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const reduceProperties = require('../utils/reduce-properties');

async function movieExists(req, res, next) {
  const { movieId } = req.params;

  const movie = await service.read(movieId);

  if (movie) {
    res.locals.movieId = movieId;
    res.locals.movie = movie;
    return next();
  }

  next({ status: 404, message: `Movie cannot be found.` });
}

async function list(req, res, next) {
  const data = await service.list(req.query.is_showing);
  res.json({ data });
}

async function read(req, res, next) {
  const { movie } = res.locals;
  res.json({ data: movie });
}

async function readTheaters(req, res, next) {
  const { movieId } = res.locals;
  const data = await service.readTheaters(movieId);
  res.json({ data: data });
}

async function readReviews(req, res, next) {
  const { movieId } = res.locals;
  const data = await service.readReviews(movieId);
  const addCriticInfo = reduceProperties('review_id', {
    critic_id: ['critic', 'critic_id'],
    preferred_name: ['critic', 'preferred_name'],
    surname: ['critic', 'surname'],
    organization_name: ['critic', 'organization_name'],
    created_at: ['critic', 'created_at'],
    updated_at: ['movies', 'updated_at'],
  });
  res.json({ data: addCriticInfo(data) });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), asyncErrorBoundary(read)],
  readTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheaters),
  ],
  readReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readReviews),
  ],
};