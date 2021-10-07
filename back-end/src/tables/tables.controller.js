const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./tables.service');

function validateCreate(req, res, next) {
    const newTable = req.body.data;
    // Check whether we were passed data at all
    if (!newTable) return next({
        status: 400,
        message: `no data submitted.`
    });
    // Check whether our data have the required fields
    const errors = [];
    const reqFields = ['table_name', 'capacity'];
    reqFields.forEach((field)=> {
        if (!newTable[field]) errors.push(`${field} field is required.`)
    });
    if (errors.length) return next({
        status: 400,
        message: errors.join(`\n`)
    })
    // Table name must be 2 characters long
    if (newTable.table_name.length < 2) return next ({
        status: 400,
        message: `table name must be at least two characters long.`
    })
    // Table must have a capacity of at least 1
    if (newTable.capacity<1) return next({
        status: 400,
        message: `capacity must be a number greater than 0.`
    })
    next();
}

async function list(req, res) {
    const response = await service.list();
    res.json({data: response})
}

async function create(req, res) {
    const newTable = req.body.data;
    res.status(201).json({data: await service.create(newTable)})
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    create: [asyncErrorBoundary(validateCreate), asyncErrorBoundary(create)]
}