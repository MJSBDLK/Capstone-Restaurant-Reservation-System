const knex = require('../db/connection');

function list(date) {
  return knex('reservations as r')
    .select('*')
    .where({ 'r.reservation_date': date })
    .orderBy('r.reservation_time');
}

function create(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

module.exports = {
  list,
  create
};