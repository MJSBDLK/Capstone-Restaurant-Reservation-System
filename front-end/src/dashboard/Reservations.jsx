import React, { useEffect, useState } from 'react';
import { listReservations } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import {Link} from 'react-router-dom';
// import {previous, today, next} from '../utils/date-time';

function Reservations({ paramKey, paramValue }) { // date can actually be any search param?
  // console.log(`start: paramKey: ${paramKey}, paramValue: ${paramValue}`);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function loadReservations() {
    const abortController = new AbortController();
    setReservationsError(null);
    // console.log(`in Load: paramKey: ${paramKey}, paramValue: ${paramValue}`);
    const params = {};
    params[paramKey] = paramValue;
    // console.log(`params: `, params);

    listReservations(params, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(loadReservations, [paramKey, paramValue]);

  function seatButton(reservation_id) {
    return (
      <Link
        to={`/reservations/${reservation_id}/seat`}
        className="btn btn-primary btn-sm"
      >
        Seat
      </Link>
    )
  }

  const resList = reservations.map((r, i) => {
    return (
      <tr id={r.reservation_id} key={i} className="justify-content-center">
        <td data-reservation-id-status={r.reservation_id}>{r.status==='booked' ? seatButton(r.reservation_id) : ''}</td>
        <td>{r.first_name}</td>
        <td>{r.last_name}</td>
        <td>{r.mobile_number}</td>
        <td>{r.reservation_date}</td>
        <td>{r.reservation_time}</td>
        <td>{r.people}</td>
        <td>{r.status}</td>
      </tr>
    );
  });

  return (
    <div className="col">
      <h4>Reservations for {paramKey==='mobile_number' ? 'mobile number:':''} {paramValue}</h4>
      <ErrorAlert error={reservationsError} />
      <table className="table table-responsive">
        <thead>
          <tr>
            <th className="pr-1">{/* {'\u00A0'} is a non-breaking space */}</th>
            <th className="pr-1">First{'\u00A0'}Name</th>
            <th className="pr-1">Last{'\u00A0'}Name</th>
            <th className="pr-1">Mobile{'\u00A0'}Number</th>
            <th className="pr-1">Reservation{'\u00A0'}Date</th>
            <th className="pr-1">Reservation{'\u00A0'}Time</th>
            <th className="pr-1">#{'\u00A0'}People</th>
            <th className="pr-1">Status</th>
          </tr>
        </thead>
        <tbody>{reservations.length ? resList : `No reservations found.`}</tbody>
      </table>
    </div>
  );
}

export default Reservations;