import React, { useState } from 'react';
import Reservations from '../dashboard/Reservations';

function Search() {
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [query, setQuery] = useState(null);

  function changeHandler({ target }) {
    setQuery(null); // clear the searched reservations on change
    setPhoneNumber(target.value);
  }
  function submitHandler(event) {
    event.preventDefault();
    setQuery(phoneNumber);
  }

  return (
    <div className="col-auto my-3">
      <h1>Search</h1>
      <form onSubmit={submitHandler} className="mb-3">
        <div className="form-group form-row">
          <label htmlFor="mobile_number">Mobile number:</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="table_name"
              placeholder="Enter a customer's phone number"
              name="mobile_number"
              onChange={changeHandler}
              required={true}
            />
            <div className="input-group-append">
              <button type="submit" className="btn btn-primary">
                Find
              </button>
            </div>
          </div>
        </div>
      </form>
      {query ? (
        <Reservations paramKey={'mobile_number'} paramValue={query} />
      ) : (
        ''
      )}
    </div>
  );
}

export default Search;
