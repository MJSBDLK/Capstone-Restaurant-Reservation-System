import React from 'react';
import Reservations from './Reservations'
import Tables from './Tables'

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-flex flex-row">
        <Reservations date={date} />
        <Tables />
      </div>
    </main>
  );
}

export default Dashboard;
