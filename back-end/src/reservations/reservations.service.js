const knex = require('../db/connection');

function create(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id })
    .first();
}

function update(reservation_id, status) {
  return knex('reservations')
    .select('*')
    .where({reservation_id})
    .update({status})
    .returning('*')
    .then((createdRecords)=>createdRecords[0]);
}

function list(date) {
  return knex('reservations')
    .select('*')
    .where({reservation_date: date})
    .whereNot({status: 'finished'})
    .orderBy('reservation_time');
}

function changeNullToBooked() {
  return knex
}

module.exports = {
  create,
  read,
  update,
  list
};
