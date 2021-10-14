import React, { useEffect, useState } from 'react';
import { listTables, deleteTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';
import { useHistory } from 'react-router';

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  useEffect(loadTables, []);

  // This does not delete anything; it just clears the table.
  async function deleteHandler(table_id) {
    if (
      window.confirm(
        `Is this table ready to seat new guests? This cannot be undone.`
      )
    ) {
      const abortController = new AbortController();
      try {
        await deleteTable(table_id);
        history.go(0);
      } catch (e) {
        setTablesError(e);
      }
      return () => abortController.abort();
    }
  }

  function finishButton(table_id) {
    return (
      <button
        className="btn btn-danger btn-sm"
        data-table-id-finish={table_id}
        onClick={() => deleteHandler(table_id)}
      >
        Finish
      </button>
    );
  }

  const tableList = tables.map((t, i) => {
    return (
      <tr id={t.table_id} key={i}>
        <td className="text-center">
          {t.reservation_id ? finishButton(t.table_id) : ''}
        </td>
        <td className="text-center" data-table-id-status={t.table_id}>
          {t.reservation_id ? 'occupied' : 'free'}
        </td>
        <td className="text-center">{t.table_name}</td>
        <td className="text-center">{t.capacity}</td>
      </tr>
    );
  });

  return (
    <div className="col justify-content-center">
      <h4 className="text-center text-sm-left">Tables</h4>
      <ErrorAlert error={tablesError} />
      <div className="d-flex justify-content-center">
        <table className="table table-sm table-responsive pb-2">
          <thead className="mw-100">
            <tr className="mw-100">
              <th className="text-center p-1">{/* empty cell */}</th>
              <th className="text-center p-1">Status</th>
              <th className="text-center p-1">Table{'\u00A0'}Name</th>
              <th className="text-center p-1">Capacity</th>
            </tr>
          </thead>
          <tbody>{tableList}</tbody>
        </table>
      </div>
    </div>
  );
}
