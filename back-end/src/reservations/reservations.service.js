const knex = require('../db/connection');

function create(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

function read(reservationId) {
  return knex('reservations')
    .select('*')
    .where({ reservationId: reservation_id })
    .first();
}

function list(date) {
  return knex('reservations as r')
    .select('*')
    .where({ 'r.reservation_date': date })
    .orderBy('r.reservation_time');
}

module.exports = {
  create,
  read,
  list
};
