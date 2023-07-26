import React from "react";
import { Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function Redirector() {
  return (
    <>
      <Navigate to={`/document/${uuidv4()}`} />
    </>
  );
}

export default Redirector;
