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
        <td className="text-center">
          {r.status === 'booked' ? seatButton(r.reservation_id) : ''}
        </td>
        <td className="text-center">{r.first_name}</td>
        <td className="text-center">{r.last_name}</td>
        <td className="text-center">{r.mobile_number}</td>
        <td className="text-center">{r.reservation_date}</td>
        <td className="text-center">{r.reservation_time}</td>
        <td className="text-center">{r.people}</td>
        <td className="text-center" data-reservation-id-status={r.reservation_id}>{r.status}</td>
        <td className="text-center">{r.status === 'booked' && editButton(r.reservation_id)}</td>
        <td className="text-center" data-reservation-id-cancel={r.reservation_id}>
          {r.status === 'booked' && cancelButton(r.reservation_id)}
        </td>
      </tr>
    );
  });

  return (
    <div className="col mw-100">
      <h4 className="mw-100 text-center text-sm-left">
        Reservations for {paramKey === 'mobile_number' ? 'mobile number:' : ''}{paramValue}
      </h4>
      <ErrorAlert error={reservationsError} />
      <table className="table mw-100 table-sm table-responsive pb-2">
        <thead className="mw-100">
          <tr className="mw-100">
            <th className="text-center p-1">{/* {'\u00A0'} is a non-breaking space */}</th>
            <th className="text-center p-1">First{'\u00A0'}Name</th>
            <th className="text-center p-1">Last{'\u00A0'}Name</th>
            <th className="text-center p-1">Mobile{'\u00A0'}Number</th>
            <th className="text-center p-1">Reservation{'\u00A0'}Date</th>
            <th className="text-center p-1">Reservation{'\u00A0'}Time</th>
            <th className="text-center p-1">#{'\u00A0'}People</th>
            <th className="text-center p-1">Status</th>
            <th className="text-center p-1">{/*empty cell*/}</th>
            <th className="text-center p-1">{/*empty cell*/}</th>
          </tr>
        </thead>
        <tbody className="mw-100">{resList}</tbody>
      </table>
      {!reservations.length && <h5 className="m-3 mw-100">No reservations found.</h5>}
    </div>
  );
}

export default Reservations;
