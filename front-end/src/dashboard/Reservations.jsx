import React, { useEffect, useState } from 'react';
import { listReservations, updateReservation } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';

function Reservations({ paramKey, paramValue }) {
  // date can actually be any search param?
  // console.log(`start: paramKey: ${paramKey}, paramValue: ${paramValue}`);
  const history = useHistory();
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
    );
  }

  function editButton(reservation_id) {
    return (
      <Link
        to={`/reservations/${reservation_id}/edit`}
        className="btn btn-primary btn-sm"
      >
        Edit
      </Link>
    );
  }

  function cancelButton(reservation_id) {
    async function cancelHandler(reservation_id) {
      const cancel = window.confirm(
        `Do you want to cancel this reservation?\nThis cannot be undone.`
      );
      if (cancel) {
        const abortController = new AbortController();
        try {
          await updateReservation(
            reservation_id,
            'cancelled',
            abortController.signal
          );
          history.go(0);
        } catch (e) {
          setReservationsError(e);
        }
        return () => abortController.abort();
      }
    }

    return (
      <button
        onClick={() => cancelHandler(reservation_id)}
        className="btn btn-danger btn-sm"
      >
        Cancel
      </button>
    );
  }

  const resList = reservations.map((r, i) => {
    if (r.status === null) r.status = 'booked'; // accounting for reservations imported when seeding
    return (
      <tr id={r.reservation_id} key={i} className="justify-content-center">
        <td>
          {r.status === 'booked' ? seatButton(r.reservation_id) : ''}
        </td>
        <td>{r.first_name}</td>
        <td>{r.last_name}</td>
        <td>{r.mobile_number}</td>
        <td>{r.reservation_date}</td>
        <td>{r.reservation_time}</td>
        <td>{r.people}</td>
        <td data-reservation-id-status={r.reservation_id}>{r.status}</td>
        <td>{r.status === 'booked' && editButton(r.reservation_id)}</td>
        <td data-reservation-id-cancel={r.reservation_id}>
          {r.status === 'booked' && cancelButton(r.reservation_id)}
        </td>
      </tr>
    );
  });

  return (
    <div className="col">
      <h4>
        Reservations for {paramKey === 'mobile_number' ? 'mobile number:' : ''}{paramValue}
      </h4>
      <ErrorAlert error={reservationsError} />
      <table className="table table-responsive">
        <thead>
          <tr>
            <th className="p-2">{/* {'\u00A0'} is a non-breaking space */}</th>
            <th className="p-2">First{'\u00A0'}Name</th>
            <th className="p-2">Last{'\u00A0'}Name</th>
            <th className="p-2">Mobile{'\u00A0'}Number</th>
            <th className="p-2">Reservation{'\u00A0'}Date</th>
            <th className="p-2">Reservation{'\u00A0'}Time</th>
            <th className="p-2">#{'\u00A0'}People</th>
            <th className="p-2">Status</th>
            <th className="p-2">{/*empty cell*/}</th>
            <th className="p-2">{/*empty cell*/}</th>
          </tr>
        </thead>
        <tbody>{resList}</tbody>
      </table>
      {!reservations.length && <h5 className="m-3">No reservations found.</h5>}
    </div>
  );
}

export default Reservations;
