import React, { useState } from "react";
import "./Dialog.css";
import { v4 as uuidv4 } from "uuid";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

function Dialog({ closeDialog }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onDocCreate = () => {
    setLoading(true);
    if (name.length === 0) return setLoading(false);
    // creating a uniqui id
    const docId = uuidv4();
    // TODO: make a api request to create a doc
    navigate(`/document/${docId}/${name}`);
  };

  return (
    <div className="dialog">
      {loading ? <Loader /> : null}
      <div className="dialog_box">
        <p className="dialog_heading">Document Name</p>
        <input
          type="text"
          className="dialog_input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="dialog_buttons">
          <button
            className="dialog_button-cancel"
            onClick={() => closeDialog()}
          >
            Cancel
          </button>
          <button className="dialog_button-create" onClick={onDocCreate}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dialog;
