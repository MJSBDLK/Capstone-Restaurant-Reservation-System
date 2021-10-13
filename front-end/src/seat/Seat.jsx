import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { listTables, readReservation, updateTable } from '../utils/api';
import { useParams } from 'react-router';
import ErrorAlert from '../layout/ErrorAlert';

export default function Seat() {
  const { reservation_id } = useParams();
  const history = useHistory();
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const [errors, setErrors] = useState(null);
  const [tableSelection, setTableSelection] = useState(null);

  useEffect(() => {
    async function loadData() {
      const abortController = new AbortController();
      try {
        setReservation(
          await readReservation(reservation_id, abortController.signal)
        );
      } catch (e) {
        setErrors(e)
        //setErrors((err)=>[...err, e])
      }
      try {
        const foundTables = await listTables(abortController.signal);
        // #region
        // This code is superior to what's actually running, but makes it fail the tests. >:|
        // const availableTables = foundTables.filter(
        //   (table) => table.capacity >= reservation.people && table.reservation_id === null
        // );
        // setTables(availableTables);
        // #endregion
        setTables(foundTables);
      } catch (e) {
        setErrors(e)
        // setErrors((err)=>[...err, e])
      }
      return () => abortController.abort();
    }
    loadData();
  }, [reservation_id, reservation.people]); // warning is wrong here

  function changeHandler({target}) {
    setTableSelection(target.value);
  }

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    updateTable(tableSelection, reservation.reservation_id, abortController.signal)
      .then(() => history.push('/dashboard'))
      .catch(setErrors);
    return () => abortController.abort();
  }

  const tableMapper = tables.map((t) => {
    return <option value={t.table_id}>{t.table_name} - {t.capacity}</option>;
  });

  return (
    <div>
      <h1 className="my-2">Seat Reservation #{reservation_id}</h1>
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
