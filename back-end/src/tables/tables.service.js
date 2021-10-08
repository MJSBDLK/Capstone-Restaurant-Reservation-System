const knex = require('../db/connection');

function create(table) {
  return knex('tables')
    .insert(table)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

function read(table_id) {
  return knex('tables')
    .select('*')
    .where({ table_id })
    .first();
}

function update(table_id, reservation_id) {
  return knex('tables')
    .select('*')
    .where({ table_id })
    .update({ reservation_id })
    .then((createdRecords) => createdRecords[0]);
}

function list() {
  return knex('tables').select('*').orderBy('table_name');
}

module.exports = {
  create,
  read,
  update,
  list,
};
