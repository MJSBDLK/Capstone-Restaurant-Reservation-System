const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./tables.service');
const reservationsService = require('../reservations/reservations.service');

// Validation
// #region
async function validateCreate(req, res, next) {
  // Validate data
  if (!req.body.data)
    return next({ status: 400, message: `no data submitted.` });

  const newTable = req.body.data;
  // Validate fields
  const errors = [];
  const reqFields = ['table_name', 'capacity'];
  reqFields.forEach((field) => {
    if (!newTable[field]) errors.push(`${field} field is required.`);
  });
  if (errors.length)
    return next({
      status: 400,
      message: errors.join('\n'),
    });
  if (typeof newTable.capacity !== 'number' || newTable.capacity < 1)
    return next({
      status: 400,
      message: `capacity must be a number greater than 0.`,
    });

  // Validate table name
  if (newTable.table_name.length < 2)
    return next({
      status: 400,
      message: `table_name must be at least two characters long.`,
    });
  next();
}

async function validateUpdate(req, res, next) {
  // Validate data
  if (!req.body.data)
    return next({ status: 400, message: `no data submitted.` });

  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  // Validate reservation_id;
  if (!reservation_id)
    return next({ status: 400, message: `reservation_id is required.` });

  const foundTable = await service.read(table_id);

  // Validate table exists
  if (!foundTable)
    return next({ status: 404, message: `cannot find table: ${table_id}` });

  const foundReservation = await reservationsService.read(reservation_id);

  // Validate reservation exists
  if (!foundReservation)
    return next({
      status: 404,
      message: `cannot find reservation: ${reservation_id}`,
    });

  res.locals.table = foundTable;
  res.locals.reservation = foundReservation;

  // Validate capacity
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  if (capacity < people)
    return next({
      status: 400,
      message: `party size may not exceed table capacity.`,
    });

  // Validate reservation is not already seated
  if (res.locals.reservation.status === 'seated')
    return next({
      status: 400,
      message: `reservation is already seated - can't seat again!`,
    });

  // Validate table is free
  if (res.locals.table.reservation_id !== null)
    // will be null if table is free
    return next({ status: 400, message: `table ${table_id} is occupied.` });

  next();
}

async function validateDelete(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);
  // return 404 for nonexistent table_id
  if (!foundTable)
    return next({
      status: 404,
      message: `table id:${table_id} not found.`,
    });
  // return 400 if table is not occupied
  if (foundTable.reservation_id === null)
    return next({
      status: 400,
      message: `table is not occupied.`,
    });
  res.locals.reservation_id = foundTable.reservation_id;
  next();
}
// #endregion

async function create(req, res) {
  const newTable = req.body.data;
  res.status(201).json({ data: await service.create(newTable) });
}

async function read(req, res) {
  // const { table_id } = req.params;
  // const { mobile_number } = req.query;
  // console.log(`table_id: ${table_id}, mobile_number: ${mobile_number}`);
  // const response = mobile_number
  //   ? await service.search(mobile_number)
  //   : await service.read(table_id);
  // res.json({ data: response });
  console.log(`Do we use read anywhere in our code?`);
}

async function update(req, res) {
  const { table_id } = res.locals.table;
  const { reservation_id } = res.locals.reservation;
  await service.update(table_id, reservation_id);
  res.json({ data: `update successful.` });
}

async function destroy(req, res) {
  // This doesn't actually delete the table; it just clears it.
  const { table_id } = req.params;
  const { reservation_id } = res.locals;
  await service.delete(table_id, reservation_id);
  res.json({ data: `update successful.` });
}

async function list(req, res) {
  const response = await service.list();
  res.json({ data: response });
}

module.exports = {
  create: [validateCreate, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(validateUpdate), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(validateDelete), asyncErrorBoundary(destroy)],
  list: [asyncErrorBoundary(list)],
};
