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
    <main className="container mw-100 py-1">
      <div className="d-flex-col">
        <h1 className="col text-center text-md-left">Dashboard</h1>
        <div className="d-flex justify-content-center justify-content-md-start px-3 mb-3">
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
      <div className="d-flex-col mw-100">
        <div className="">
          <Reservations paramKey={'date'} paramValue={date} />
        </div>
        <div className="">
          <Tables />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
