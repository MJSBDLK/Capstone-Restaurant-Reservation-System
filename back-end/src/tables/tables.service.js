const knex = require('../db/connection');

function create(table) {
  return knex('tables')
    .insert(table)
    .returning('*')
    .then((createdRecords) => createdRecords[0]);
}

function read(table_id) {
  return knex('tables').select('*').where({ table_id }).first();
}

// // This seats the reservation
// function update(table_id, reservation_id) {
//   return knex.transaction(async(trx)=> {
//     await trx('tables')
//       .select('*')
//       .where({ table_id })
//       .update({ reservation_id })
    
//     await trx('reservations')
//       .select('*')
//       .where({reservation_id})
//       .update({status: 'seated'})
//   });
// }

// Update seats a reservation at a specified table.
function update(table_id, reservation_id) {
  return knex.transaction(async(trx)=> {
    await trx('tables')
      .select('*')
      .where({table_id})
      .update({reservation_id});
    await trx('reservations')
      .select('*')
      .where({reservation_id})
      .update({status: 'seated'});
  });
}

// Destroy finishes a seated reservation.
function destroy(table_id, reservation_id) {
  return knex.transaction(async (trx)=> {
    await trx('tables')
      .select('*')
      .where({ table_id })
      .update({ reservation_id: null })
    await trx('reservations')
      .select('*')
      .where({reservation_id})
      .update({status: 'finished'})
  });
}

function list() {
  return knex('tables').select('*').orderBy('table_name');
}

module.exports = {
  create,
  read,
  update,
  delete: destroy,
  list,
};
