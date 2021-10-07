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
        setErrors(e);
      }
      try {
        const foundTables = await listTables(abortController.signal);
        const availableTables = foundTables.filter(
          (table) => table.capacity >= reservation.people
        );
        setTables(availableTables);
      } catch (e) {
        setErrors(e);
      }
      return () => abortController.abort();
    }
    loadData();
  }, [reservationId]); // warning is wrong here

  function submitHandler(event) {
    event.preventDefault();
    console.log(`event.target: `, event.target);
    const abortController = new AbortController();
    const foundTable = tables.find(
      (table) => table.table_name === event.target.table_id
    );
    const updatedTable = { ...foundTable };
    updateTable(updatedTable, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch(setErrors);
    return () => abortController.abort();
  }

  const tableMapper = tables.map((t, i) => {
    return <option value={i + 1}>{t.table_name}</option>;
  });

  return (
    <div>
      <h1 className="my-2">Seat Reservation #{reservationId}</h1>
      <ErrorAlert error={errors} />
      <form onSubmit={submitHandler} className="mb-2">
        <div className="form-group col-md-4">
          <label for="table_id">Table</label>
          <select
            name="table_id"
            className="form-control"
            id="table_id"
            placeholder="Table ID"
          >
            <option>Select Table</option>
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
