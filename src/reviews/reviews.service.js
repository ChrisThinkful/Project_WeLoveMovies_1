const knex = require('../db/connection');

function read(reviewId) {
 return knex('reviews')
    .select('*')
    .where('review_id', reviewId)
    .first();
}

function updatedRead(review_id) {
  return knex('reviews')
  .join('critics', 'reviews.critic_id', 'critics.critic_id')
  .select('*')
  .where({review_id});

}
function update(review_id, newReview) {
 return knex('reviews')
    .where({review_id})
    .update(newReview);  
}

function destroy(review_id) {
 return knex('reviews')
    .select('*')
    .where({review_id})
    .del();
}

module.exports = {
    read,
    updatedRead,
    update,
    delete: destroy,
};