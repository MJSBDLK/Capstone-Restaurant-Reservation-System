import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { listTables, readReservation, updateTable } from '../utils/api';
import { useParams } from 'react-router';
import ErrorAlert from '../layout/ErrorAlert';

export default function Seat() {
  const { reservationId } = useParams();
  const history = useHistory();
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const [errors, setErrors] = useState(null);
  const [tableSelection, setTableSelection] = useState(null);

  //#region
  // We need to load the reservation to know the minimum capacity
  // function loadReservation() {
  //   const abortController = new AbortController();
  //   setReservationErrors(null)
  //   readReservation(reservationId, abortController.signal)
  //     .then(setReservation)
  //     .catch(setReservationErrors);
  //   return ()=>abortController.abort();
  // }

  // function loadTables() {
  //   const abortController = new AbortController();
  //   listTables(abortController.signal)
  //       .then(setTables)
  //       .catch(setTablesErrors);
  //   return () => abortController.abort();
  // }

  // function loadData() {
  //   const abortController = new AbortController();
  //   const errors = [];
  //   readReservation(reservationId, abortController.signal)
  //     .then(setReservation)
  //     .catch(e=>errors.push(e));
  //   listTables(abortController.signal)
  //     .then(setTables)
  //     .catch(e=>errors.push(e));
  //   if (errors.length) setErrors(errors);
  //   return ()=>abortController.abort();
  //  }
  //#endregion

  useEffect(() => {
    async function loadData() {
      const abortController = new AbortController();
      try {
        setReservation(
          await readReservation(reservationId, abortController.signal)
        );
      } catch (e) {
        setErrors((err)=>[...err, e])
      }
      try {
        const foundTables = await listTables(abortController.signal);
        // const availableTables = foundTables.filter(
        //   (table) => table.capacity >= reservation.people && table.reservation_id === null
        // );
        // setTables(availableTables);
        setTables(foundTables);
      } catch (e) {
        setErrors((err)=>[...err, e])
      }
      return () => abortController.abort();
    }
    loadData();
  }, [reservationId, reservation.people]); // warning is wrong here

  function changeHandler({target}) {
    setTableSelection(target.value);
  }

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    updateTable(tableSelection, reservation.reservation_id, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch(setErrors);
    return () => abortController.abort();
  }

  const tableMapper = tables.map((t) => {
    return <option value={t.table_id}>{t.table_name} - {t.capacity}</option>;
  });

  return (
    <div>
      <h1 className="my-2">Seat Reservation #{reservationId}</h1>
      <ErrorAlert error={errors} />
      <form onSubmit={submitHandler} className="mb-2">
        <div className="form-group col-md-4">
          <label htmlFor="table_id">Table</label>
          <select
            name="table_id"
            className="form-control"
            id="table_id"
            placeholder="Table ID"
            onChange={changeHandler}
          >
            <option>{tables.length ? `Select table` : `Loading tables...`}</option>
            {tableMapper}
          </select>
          <div className="">
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
        </div>
      </form>
    </div>
  );
}
