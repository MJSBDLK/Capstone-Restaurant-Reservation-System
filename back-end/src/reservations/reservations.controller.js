const P = require('pino');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');
const service = require('./reservations.service');

// Helper functions 
// #region
function formatDate(date, time) {
  // console.log(`date, time: `, date, time);
  const result = new Date();
  result.setFullYear(date.slice(0,4));
  result.setMonth(date.slice(5,7));
  result.setDate(date.slice(8));
  result.setHours(parseInt(time.slice(0,2)),parseInt(time.slice(3,5)),0);
  // console.log(`result, step 3: `, result);
  return result;
}

function isTuesday(date) {
  const resDate = new Date (date.split('-').join('/'))
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
  resTime.setHours(parseInt(time.slice(0,2)),parseInt(time.slice(3,5)),0);//Jank-ass workaround
  const open = new Date();
  const close = new Date();
  open.setHours(10,30,0);
  close.setHours(21,30,0);
  if (resTime > open && resTime < close) return true;
  return false;
}
// #endregion

// Validation
// #region
function validateReservation(req, res, next) {
  const newReservation = req.body.data;
  // console.log(`newReservation: `, newReservation);
  if (!newReservation) return next({
    status: 400,
    message: `no data submitted.`
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
  if (typeof newReservation.people !== 'number') errors.push(`people field must be a number.`); // tests test for lowercase "people" for some reason
  if (!/\d\d:\d\d/.test(newReservation.reservation_time)) errors.push(`reservation_time must have format HH:MM.`); //regex wizardry courtesy of Justin
  if (Number.isNaN(Date.parse(newReservation.reservation_date))) errors.push(`reservation_date must have format YYYY:MM:DD.`);
  if (isTuesday(newReservation.reservation_date)) errors.push(`The restaurant is closed on Tuesdays.`);
  if (isPast(newReservation.reservation_date, newReservation.reservation_time)) errors.push(`No time travelers: reservation date and time must be in the future.`);
  if (!restaurantOpen(newReservation.reservation_time)) errors.push(`Reservation must be between 10:30 AM and 9:30 PM.`);
  // console.log(`errors: `, errors)
  if (errors.length) {
    return next({
      status: 400,
      message: errors.join(`\n`)
    })
  }
  next();
}
// #endregion


async function create(req, res, next) {
  const reservation = req.body.data;
  reservation.status = 'Booked'
  res.status(201).json({data: await service.create(reservation)});
}

async function read(req, res) {
  const {reservationId} = req.params;
  res.json({data: await service.read(reservationId)});
}

async function list(req, res) {
  // console.log(`list running...`)
  const {date} = req.query;
  res.json({
    data: await service.list(date),
  });
}

module.exports = {
  create: [validateReservation, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)]
};
