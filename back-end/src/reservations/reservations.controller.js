const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');

/**
 * List handler for reservation resources
 */
function validateReservation(req, res, next) {
  const newReservation = req.body.data;
  if (!newReservation) return next({
    status: 400,
    message: `no data submitted`
  });
  const errors = [];
  // console.log(`newReservation:`, newReservation)
  // console.log(`Object.keys(newReservation) : `, Object.keys(newReservation))
  const reqFields = ['first_name', 'last_name', 'mobile_number', 'reservation_date', 'reservation_time', 'people']
  reqFields.forEach((field)=> {
    if (!newReservation[field]) {
      errors.push(`${field} field is required.`)
    }
  });
  if (typeof newReservation.people !== 'number') errors.push(`people field must be a number`);
  if (!/\d\d:\d\d/.test(newReservation.reservation_time)) errors.push(`reservation_time must have format HH:MM`);
  if (Number.isNaN(Date.parse(newReservation.reservation_date))) errors.push(`reservation_date must have format YYYY:MM:DD`);
  // console.log(`errors: `, errors)
  if (errors.length) {
    return next({
      status: 400,
      message: errors.join(`\n`)
    })
  }
  next();
}

async function list(req, res) {
  const {date} = req.query;
  res.json({
    data: await service.list(date),
  });
}

async function create(req, res, next) {
  const reservation = req.body.data;
  res.status(201).json({data: await service.create(reservation)});
}

module.exports = {
  create: [validateReservation, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
