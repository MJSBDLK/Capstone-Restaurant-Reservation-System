const knex = require('../db/connection');

function list() {
    console.log(`service.list running...`)
    return knex('tables').select('*');
}

module.exports = {
    list
}