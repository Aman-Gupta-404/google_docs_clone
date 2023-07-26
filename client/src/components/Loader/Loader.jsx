import React from "react";
import "./Loader.css";

function Loader() {
  return (
    <div className="loader">
      <div class="lds-ellipsis">
        <div id="loader_red"></div>
        <div id="loader_blue"></div>
        <div id="loader_green"></div>
        <div id="loader_red"></div>
      </div>
    </div>
  );
}

export default Loader;
