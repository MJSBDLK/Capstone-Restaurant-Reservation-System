const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');

// Helper functions
// #region
function formatDate(date, time) {
  // console.log(`date, time: `, date, time);
  const result = new Date();
  result.setFullYear(date.slice(0, 4));
  result.setMonth(date.slice(5, 7));
  result.setDate(date.slice(8));
  result.setHours(parseInt(time.slice(0, 2)), parseInt(time.slice(3, 5)), 0);
  // console.log(`result, step 3: `, result);
  return result;
}

function isTuesday(date) {
  const resDate = new Date(date.split('-').join('/'));
  const day = resDate.getDay();
  if (day === 2) return true;
  return false;
}

function isPast(date, time) {
  const resDate = formatDate(date, time);
  const rightNow = new Date();
  // console.log(`resDate, rightNow: `, resDate, rightNow);
  if (resDate < rightNow) return true;
  return false;
}

function restaurantOpen(time) {
  const resTime = new Date();
  resTime.setHours(parseInt(time.slice(0, 2)), parseInt(time.slice(3, 5)), 0); //Jank-ass workaround
  const open = new Date();
  const close = new Date();
  open.setHours(10, 30, 0);
  close.setHours(21, 30, 0);
  if (resTime > open && resTime < close) return true;
  return false;
}
// #endregion

// Validation
// #region
function validateCreate(req, res, next) {
  const newReservation = req.body.data;

  // Validate data
  if (!newReservation)
    return next({
      status: 400,
      message: `no data submitted.`,
    });

  // Validate fields
  const errors = [];
  const reqFields = [
    'first_name',
    'last_name',
    'mobile_number',
    'reservation_date',
    'reservation_time',
    'people',
  ];
  reqFields.forEach((field) => {
    if (!newReservation[field]) {
      errors.push(`${field} field is required.`);
    }
  });
  if (errors.length)
    return next({
      status: 400,
      message: errors.join('\n'),
    });

  // Validate party size is a number
  if (typeof newReservation.people !== 'number')
    return next({
      status: 400,
      message: `people field must be a number.`,
    });

  // Validate reservation_time format
  if (!/\d\d:\d\d/.test(newReservation.reservation_time))
    return next({
      status: 400,
      message: `reservation_time must have format HH:MM.`,
    });

  // Validate reservation_date format
  if (Number.isNaN(Date.parse(newReservation.reservation_date)))
    return next({
      status: 400,
      message: `reservation_date must have format YYYY:MM:DD.`,
    });

  // Validate reservation is not for a Tuesday
  if (isTuesday(newReservation.reservation_date))
    return next({
      status: 400,
      message: `the restaurant is closed on Tuesdays.`,
    });

  // Validate reservation is not in the past
  if (isPast(newReservation.reservation_date, newReservation.reservation_time))
    return next({
      status: 400,
      message: `No time travelers: reservation date and time must be in the future.`,
    });

  // Validate restaurant is open
  if (!restaurantOpen(newReservation.reservation_time))
    return next({
      status: 400,
      message: `Reservation must be between 10:30 AM and 9:30 PM.`,
    });
  
  // Validate status
  const unacceptable = ['seated', 'finished'];
  if (newReservation.status && unacceptable.includes(newReservation.status)) return next({
    status:400,
    message:`cannot create a reservation with a status of "seated" or "finished".`
  });

  next();
}

async function validateUpdate(req, res, next) {
  // Validate reservation exists
  const { reservation_id } = req.params;
  const foundReservation = await service.read(reservation_id);
  if (!foundReservation)
    return next({
      status: 404,
      message: `reservation ${reservation_id} not found.`,
    });

  // Validate status passed in
  const { status } = req.body.data;
  const acceptable = ['booked', 'seated', 'finished']
  if (!acceptable.includes(status)) return next({
    status:400,
    message: `unrecognized status: ${status}`
  });

  // Validate found reservation is not 'finished'
  if (foundReservation.status === 'finished')
    return next({
      status: 400,
      message: `a "finished" reservation cannot be updated.`,
    });

  next();
}
// #endregion

async function create(req, res) {
  const reservation = { ...req.body.data };
  reservation.status = 'booked';
  res.status(201).json({ data: await service.create(reservation) });
}

async function read(req, res, next) {
  const { reservation_id } = req.params;
  const response = await service.read(reservation_id);
  if (!response)
    return next({
      status: 404,
      message: `reservation ${reservation_id} not found.`,
    });
  res.json({ data: response });
}

async function update(req, res) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;
  const response = await service.update(reservation_id, status);
  res.json({ data: response });
}

async function list(req, res) {
    const { date, mobile_number } = req.query;
    console.log(`date: ${date}, mobile_number: ${mobile_number}`);
    const response = mobile_number
      ? await service.search(mobile_number)
      : await service.list(date);
    res.json({ data: response });
  }

module.exports = {
  create: [validateCreate, asyncErrorBoundary(create)],
  read: asyncErrorBoundary(read),
  update: [asyncErrorBoundary(validateUpdate), asyncErrorBoundary(update)],
  list: asyncErrorBoundary(list),
};
