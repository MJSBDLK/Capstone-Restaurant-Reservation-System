import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { postReservation } from '../utils/api';
import { today } from '../utils/date-time';
import ErrorAlert from '../layout/ErrorAlert';

function NewReservation() {
  const history = useHistory();
  const [reservation, setReservation] = useState({
    first_name: '',
    last_name: '',
    mobile_number: '',
    reservation_date: '',
    reservation_time: '',
    people: 0,
  });
  const [errors, setErrors] = useState(null);

  function submitHandler(event) {
    event.preventDefault();
    const newReservation = {...reservation};
    newReservation.people = parseInt(newReservation.people)
    postReservation(newReservation)
      .then(() => {
        history.push(`/reservations?date=${reservation.reservation_date}`);
      })
      .catch(setErrors);
  }

  function changeHandler({ target: { name, value } }) {
    setReservation((prevRes) => ({
      ...prevRes,
      [name]: value, // doesn't work if the keys are named differently
    }));
    // console.log(`allFields: `, reservation)
  }

  return (
    <div>
      <h1 className="my-2">New Reservation</h1>
      <ErrorAlert error={errors} />
      <form onSubmit={submitHandler} className="mb-2">
        <div className="form-row">
          <div className="form-group col-md-4">
            <label for="first_name">First name: </label>
            <input
              type="text"
              className="form-control"
              id="first_name"
              placeholder="First name"
              name="first_name"
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label for="last_name">Last name: </label>
            <input
              type="text"
              className="form-control"
              id="last_name"
              placeholder="Last name"
              name="last_name"
              onChange={changeHandler}
              required={true}
            />
          </div>
          <div className="form-group col-md-4">
            <label for="mobile_number">Mobile number: </label>
            <input
              type="text"
              className="form-control"
              id="mobile_number"
              placeholder="Mobile number"
              name="mobile_number"
              onChange={changeHandler}
              required={true}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label for="reservation_date">Date of reservation: </label>
            <input
              type="date"
              className="form-control"
              id="reservation_date"
              placeholder="Select date"
              name="reservation_date"
              onChange={changeHandler}
              required={true}
              min={today()}
            />
          </div>
          <div className="form-group col-md-4">
            <label for="reservation_time">Time of reservation: </label>
            <input
              type="time"
              className="form-control"
              id="reservation_time"
              name="reservation_time"
              onChange={changeHandler}
              required={true}
              min="10:30"
              max="21:30"
            />
          </div>
          <div className="form-group col-md-4">
            <label for="people">Number of people: </label>
            <input
              type="number"
              step="1"
              className="form-control"
              id="people"
              placeholder="Number of people in party"
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

export default NewReservation;
