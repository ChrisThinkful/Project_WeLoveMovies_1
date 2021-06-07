const knex = require('../db/connection');

function list(is_showing) {
    return knex('movies')
      .select('movies.*')
      .modify((queryBuilder) => {
        if (is_showing) {
          queryBuilder
            .join(
              'movies_theaters',
              'movies.movie_id',
              'movies_theaters.movie_id'
            )
            .where({ 'movies_theaters.is_showing': true })
            .groupBy('movies.movie_id');
        }
      });
  }

function read(movie_id) {
    return knex('movies')
      .select('*')
      .where({movie_id})
      .first();
}

function readTheaters(movie_id) {
   return knex('theaters')
    .join('movies_theaters','movies_theaters.theater_id','theaters.theater_id')
    .select('*')
    .where('movie_id', movie_id);
}

function readReviews(movie_id) {
    return knex('reviews')
      .join('critics','reviews.critic_id','critics.critic_id')
      .select('*')
      .where('reviews.movie_id', movie_id);
 }

module.exports = {
    list,
    read,
    readTheaters,
    readReviews,
};