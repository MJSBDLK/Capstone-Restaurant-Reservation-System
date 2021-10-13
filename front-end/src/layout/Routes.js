import React from 'react';

import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import NotFound from './NotFound';
import { today } from '../utils/date-time';
// import NewReservation from '../newReservation/NewReservation';
import NewTable from '../newTable/NewTable';
import Seat from '../seat/Seat';
import Search from '../search/Search';
import ReservationForm from '../reservationForm/ReservationForm';

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {

  const queries = new URLSearchParams(useLocation().search);
  const date = queries.get('date');

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={'/dashboard'} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/tables/new">
        <NewTable />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seat />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm />
      </Route>
      <Route path="/reservations">
        <Dashboard date={date || today()} />
      </Route>
      <Route exact={true} path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
