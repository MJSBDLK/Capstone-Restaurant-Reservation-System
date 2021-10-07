import React, { useState } from 'react';
import { useHistory } from 'react-router';
import ErrorAlert from '../layout/ErrorAlert';
import {createTable} from '../utils/api';

function NewTable() {
  const history = useHistory();
  const [table, setTable] = useState({
      table_name: null,
      capacity: null
  });
  const [errors, setErrors] = useState(null);

  function changeHandler({ target: { name, value } }) {
      setTable((prevTable) => ({
          ...prevTable,
          [name]: value,
      }));
  }
  
  function submitHandler(event) {
      const abortController = new AbortController();
      event.preventDefault();
      const newTable = {...table};
      newTable.capacity = parseInt(newTable.capacity); // ensure we're sending a number to the backend
      createTable(newTable).then(()=> {
          history.push(`/dashboard`);
      }).catch(setErrors);
      return ()=>abortController.abort();
  }

  return (
    <div>
      <h1 className="my-2">New Table</h1>
      <ErrorAlert error={errors} />
      <form onSubmit={submitHandler} className="mb-2">
        <div className="form-group col-md-4">
          <label htmlFor="table_name">Table name:</label>
          <input
            type="text"
            className="form-control"
            id="table_name"
            placeholder="Table name"
            name="table_name"
            onChange={changeHandler}
            required={true}
          />
        </div>
        <div className="form-group col-md-4">
          <label htmlFor="capacity">Table capacity:</label>
          <input
            type="number"
            step="1"
            className="form-control"
            id="capacity"
            placeholder="Max capacity of table"
            name="capacity"
            onChange={changeHandler}
            min="1"
            required={true}
          />
        </div>
        <div>
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
      </form>
    </div>
  );
}

export default NewTable;
