import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listReservations } from '../utils/api';
import {previous, today, next} from '../utils/date-time';
import ErrorAlert from '../layout/ErrorAlert';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({date}) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({date}, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // console.log(`reservations: `, reservations);

  // Maps the reservations into JSX table rows
  const resList = reservations.map((r, i)=> {
    return (
      <tr id={r.reservation_id} key={i}>
        <td>{r.reservation_id}</td>
        <td>{r.first_name}</td>
        <td>{r.last_name}</td>
        <td>{r.mobile_number}</td>
        <td>{r.reservation_date}</td>
        <td>{r.reservation_time}</td>
        <td>{r.people}</td>
      </tr>
    )
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">{date ? `Reservations for ${date}` : `All reservations` }</h4>
      </div>
      <div className="d-md-flex mb-3">
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
      <div className="table table-no-wrap">
        <thead>
          <tr>
            <th className="pr-1">Index</th>
            <th className="pr-1">First Name</th>
            <th className="pr-1">Last Name</th>
            <th className="pr-1">Mobile Number</th>
            <th className="pr-1">Reservation Date</th>
            <th className="pr-1">Reservation Time</th>
            <th className="pr-1"># People</th>
          </tr>
        </thead>
        <tbody>{resList}</tbody>
      </div>
    </main>
  );
}

export default Dashboard;
