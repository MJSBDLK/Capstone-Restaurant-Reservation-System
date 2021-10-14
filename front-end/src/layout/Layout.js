import React from "react";
import Menu from "./Menu";
import Routes from "./Routes";

import "./Layout.css";

/**
 * Defines the main layout of the application.
 *
 * You will not need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div className="">
      <div className="d-flex flex-column flex-lg-row">
        <div className="side-bar col-lg-2 p-2">
          <Menu />
        </div>
        <div className="col-auto">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;
