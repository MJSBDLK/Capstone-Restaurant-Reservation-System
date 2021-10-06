const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');

async function list(req, res) {
    console.log(`controller.list running...`)
    const response = await service.list();
    res.json({data: response})
}

module.exports = {
    list: [asyncErrorBoundary(list)]
}