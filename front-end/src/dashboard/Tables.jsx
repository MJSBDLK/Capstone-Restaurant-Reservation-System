import React, { useEffect, useState } from 'react';
import {listTables, finishTable} from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

export default function Tables() {
    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);

    function loadTables() {
        const abortController = new AbortController();
        setTablesError(null);
        listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
        return ()=>abortController.abort();
    }

    useEffect(loadTables, []);

    async function deleteHandler(table_id) {
      const abortController = new AbortController();
      try {
        await finishTable(table_id)
        loadTables();
      } catch (e) {setTablesError(e)}
      return ()=>abortController.abort();
    }

    function finishButton(table_id) {
      return(
        <button className="btn btn-danger btn-sm" onClick={()=>deleteHandler(table_id)}>
          Finish
        </button>
      )
    }

    const tableList = tables.map((t, i) => {
        return (
          <tr id={t.table_id} key={i}>
            <td>{t.reservation_id ? finishButton(t.table_id) : ''}</td>
            <td>{t.reservation_id ? 'Occupied' : 'Free'}</td>
            <td>{t.table_name}</td>
            <td>{t.capacity}</td>
          </tr>
        );
      });

  return (
    <div className="col">
      <h4>Tables</h4>
      <ErrorAlert error={tablesError} />
      <table className="table table-responsive">
        <thead>
          <tr>
            <th className="pr-1">{/* Empty cell */}</th>
            <th className="pr-1">Status</th>
            <th className="pr-1">Table Name</th>
            <th className="pr-1">Capacity</th>
          </tr>
        </thead>
        <tbody>{tableList}</tbody>
      </table>
    </div>
  );
}
