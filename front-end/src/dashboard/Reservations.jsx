import React, { useEffect, useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import {Link} from 'react-router-dom';
import {previous, today, next} from '../utils/date-time';

function Reservations({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadReservations, [date]);

  const resList = reservations.map((r, i) => {
    return (
      <tr id={r.reservation_id} key={i} className="justify-content-center">
        <td>
          <Link
            to={`/reservations/${r.reservation_id}/seat`}
            className="btn btn-primary btn-sm"
          >
            Seat
          </Link>
        </td>
        <td>{r.first_name}</td>
        <td>{r.last_name}</td>
        <td>{r.mobile_number}</td>
        <td>{r.reservation_date}</td>
        <td>{r.reservation_time}</td>
        <td>{r.people}</td>
      </tr>
    );
  });

  return (
    <div className="col">
      <h4>Reservations for {date}</h4>
      <div className="d-md-flex">
        <Link
          type="button"
          className="btn btn-secondary m-1"
          to={`/reservations/?date=${previous(date)}`}
        >
          Previous
        </Link>
        <Link
          type="button"
          className="btn btn-secondary m-1"
          to={`/reservations/?date=${today()}`}
        >
          Today
        </Link>
        <Link
          type="button"
          className="btn btn-secondary m-1"
          to={`/reservations/?date=${next(date)}`}
        >
          Next
        </Link>
      </div>
      <ErrorAlert error={reservationsError} />
      <table className="table table-responsive">
        <thead>
          <tr>
            <th className="pr-1">{/* empty cell */}</th>
            <th className="pr-1">First Name</th>
            <th className="pr-1">Last Name</th>
            <th className="pr-1">Mobile Number</th>
            <th className="pr-1">Reservation Date</th>
            <th className="pr-1">Reservation Time</th>
            <th className="pr-1"># People</th>
          </tr>
        </thead>
        <tbody>{resList}</tbody>
      </table>
    </div>
  );
}

export default Reservations;