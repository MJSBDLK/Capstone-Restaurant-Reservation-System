const knex = require('../db/connection');

function create(reservation) {
  return knex('reservations')
    .insert(reservation)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex('reservations').select('*').where({ reservation_id }).first();
}

// Updates reservation status only
function update(reservation_id, status) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id })
    .update({ status })
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}
// CRUDL - the "real" update
function modify(reservation_id, newReservation) {
  return knex('reservations')
    .select('*')
    .where({ reservation_id })
    .update(newReservation)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

function list(date) {
  return knex('reservations')
    .select('*')
    .where({reservation_date: date})
    .whereNotIn('status', ['finished', 'cancelled'])
    .orderBy('reservation_time');
}

// CRUDL - also list
function search(mobile_number) {
  return knex('reservations')
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, '')}%`
    )
    .orderBy('reservation_date');
}

module.exports = {
  create,
  read,
  search,
  update,
  modify,
  list,
};
