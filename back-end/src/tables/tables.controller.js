const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./tables.service');
const reservationsService = require('../reservations/reservations.service')

function validateData(req, res, next) {
  const {data} = req.body;
  if (!data)
    return next({
      status: 400,
      message: `no data submitted.`,
    });
  next();
}

function validateFields(req, res, next) {
  const errors = [];
  const reqFields = ['table_name', 'capacity'];
  const table = req.body.data;
  reqFields.forEach((field) => {
    if (!table[field]) errors.push(`${field} field is required.`);
  });
  if (errors.length)
    return next({
      status: 400,
      message: errors.join(`\n`),
    });
  if (typeof table.capacity !== 'number' || table.capacity < 1)
  return next({
    status: 400,
    message: `capacity must be a number greater than 0.`,
  });
  next();
}

function validateTableName(req, res, next) {
  const { table_name } = req.body.data;
  // Table name must be 2 characters long
  if (table_name.length < 2)
    return next({
      status: 400,
      message: `table_name must be at least two characters long.`,
    });
  next();
}

async function validateCapacity(req, res, next) {
  const {table_id} = req.params;
  const table = await service.read(table_id);
  const {people} = res.locals.reservation;
  console.log(`people: ${people} capacity: ${table.capacity}`)
  if (table.capacity < people) {
    return next({
      status: 400,
      message: `party size may not exceed table capacity.`
    })
  }
  next();
}

async function validateFree(req, res, next) {
  const {table_id} = req.params;
  const table = await service.read(table_id);
  if (table.reservation_id !== null) return next({
    status: 400,
    message: `requested table is occupied.`
  });
  next();
}

async function validateReservationId(req, res, next) {
    const {reservation_id} = req.body.data;
    if (!reservation_id) return next({
        status: 400,
        message: `reservation_id required.`
    })
    const reservation = await reservationsService.read(reservation_id);
    if (!reservation) return next({
        status: 404,
        message: `reservation ${reservation_id} not found`
    })
    res.locals.reservation = reservation;
    next();
}

async function create(req, res) {
  const newTable = req.body.data;
  res.status(201).json({ data: await service.create(newTable) });
}

async function read(req, res) {
  const {table_id} = req.params;
  const response = await service.read(table_id);
  res.json({data: response})
}

async function update(req, res) {
  const { table_id } = req.params;
  const {reservation_id} = req.body.data;
  const response = await service.update(table_id, reservation_id);
  res.json({ data: response });
}

async function list(req, res) {
  const response = await service.list();
  res.json({ data: response });
}

module.exports = {
  create: [
    validateData,
    validateFields,
    validateTableName,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(read)],
  update: [
    validateData,
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateCapacity),
    asyncErrorBoundary(validateFree),
    asyncErrorBoundary(update)
  ],
  list: [asyncErrorBoundary(list)],
};
