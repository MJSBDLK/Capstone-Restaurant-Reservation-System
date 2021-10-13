import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  createReservation,
  readReservation,
  modifyReservation,
} from '../utils/api';
import { formatAsDate, formatAsTime } from '../utils/date-time';
import ErrorAlert from '../layout/ErrorAlert';

function ReservationForm() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 0,
  });
  const [errors, setErrors] = useState(null);

  // fetch the reservation if reservation_id is defined
  useEffect(() => {
    async function loadReservation() {
      setErrors(null);
      const abortController = new AbortController();
      try {
        setReservation(
          await readReservation(reservation_id, abortController.signal)
        );
        // console.log(`reservation: `, JSON.stringify(reservation, null, 4));
      } catch (e) {
        setErrors(e);
      }
      return () => abortController.abort();
    }
    // console.log(`reservation_id: `, reservation_id)
    if (reservation_id) {
      loadReservation();
    }
  }, [reservation_id]);
  
  function submitHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    const abortController = new AbortController();
    const newReservation = { ...reservation };
    newReservation.reservation_date = formatAsDate(
      newReservation.reservation_date
    );
    newReservation.reservation_time = formatAsTime(
      newReservation.reservation_time
    );
    newReservation.people = parseInt(newReservation.people);
    if (reservation_id) {
      modifyReservation(newReservation, abortController.signal)
        .then(()=>history.push(`/dashboard?date=${reservation.reservation_date}`))
        .catch(setErrors);
    } else {
      createReservation(newReservation, abortController.signal)
        .then(()=>history.push(`/dashboard?date=${reservation.reservation_date}`))
        .catch(setErrors);
    }
    return () => abortController.abort();
  }

  function changeHandler({ target: { name, value } }) {
    setReservation((prevRes) => ({
      ...prevRes,
      [name]: value, // doesn't work if the keys are named differently
    }));
  }

  return (
    <div>
      <h1 className="my-2">
        {reservation_id ? 'Edit' : 'New'} Reservation
        {reservation_id && ` ${reservation_id}`}
      </h1>
      <ErrorAlert error={errors} />
      <form onSubmit={submitHandler} className="mb-2">
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="first_name">First name: </label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              defaultValue={reservation.first_name}
              name="first_name"
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="last_name">Last name: </label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              defaultValue={reservation.last_name}
              name="last_name"
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="mobile_number">Mobile number: </label>
            <input
              type="text"
              className="form-control"
              id="mobile_number"
              defaultValue={reservation.mobile_number}
              name="mobile_number"
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="reservation_date">Date of reservation: </label>
            <input
              type="date"
              className="form-control"
              id="reservation_date"
              defaultValue={reservation.reservation_date}
              name="reservation_date"
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="reservation_time">Time of reservation: </label>
            <input
              type="time"
              className="form-control"
              id="reservation_time"
              defaultValue={reservation.reservation_time}
              name="reservation_time"
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="people">Number of people: </label>
            <input
              type="number"
              step="1"
              className="form-control"
              id="people"
              value={parseInt(reservation.people)}
              name="people"
              onChange={changeHandler}
              min="1"
              required={true}
            />
          </div>
        </div>
        <div>
          <button type="submit" className="btn btn-primary m-1">
            Submit
          </button>
          <button
            className="btn btn-secondary m-1"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
