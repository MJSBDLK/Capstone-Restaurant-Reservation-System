import React from 'react';
import Reservations from './Reservations';
import Tables from './Tables';
import { Link } from 'react-router-dom';
import { previous, today, next } from '../utils/date-time';

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  return (
    <main>
      <div className="d-flex-row justify-content-between">
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <Link
            type="button"
            className="btn btn-secondary btn-sm m-1"
            to={`/reservations/?date=${previous(date)}`}
          >
            Previous
          </Link>
          <Link
            type="button"
            className="btn btn-secondary btn-sm m-1"
            to={`/reservations/?date=${today()}`}
          >
            Today
          </Link>
          <Link
            type="button"
            className="btn btn-secondary btn-sm m-1"
            to={`/reservations/?date=${next(date)}`}
          >
            Next
          </Link>
        </div>
      </div>
      <div className="d-inline-flex flex-row">
        <div className="col">
          <Reservations paramKey={'date'} paramValue={date} />
        </div>
        <Tables />
      </div>
    </main>
  );
}

export default Dashboard;
