import React, { useState, useEffect } from "react";
import "./FilesPage.css";
import {
  AiOutlineFileAdd,
  AiOutlineFile,
  AiOutlineSearch,
  AiOutlineClose,
} from "react-icons/ai";
import { BsShare } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
import Dialog from "../../components/Dialog/Dialog";
import axios from "axios";

function FilesPage() {
  const navigate = useNavigate();
  const [docsList, setDocsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [searchText, setSearchText] = useState("");

  const openDialog = () => {
    console.log("this works");
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
  };

  const openDoc = (id, name) => {
    navigate(`/document/${id}/${name}`);
  };

  const renderDocListItem = (item, i) => {
    return (
      <>
        <div
          className="list_item"
          key={i}
          onClick={() => openDoc(item._id, item.documentName)}
        >
          <div className="listName">
            <p className="listName__text">
              <AiOutlineFile id="listItem__logo" />
              {item.documentName}
            </p>
          </div>
          <div className="list_options">
            <BsShare
              id="listItem__logo"
              onClick={(e) => {
                e.preventDefault();
                console.log("here boi");
                navigator.clipboard.writeText("text boss");
              }}
            />
            {/* <MdDeleteOutline id="listItem__logo" /> */}
          </div>
        </div>
        {/* //TODO: check why is this not working */}
        <hr id="list_item_hr" />
      </>
    );
  };

  useEffect(() => {
    const getAllDocs = () => {
      setLoading(true);
      axios.get("http://localhost:9000/api/v1/document/get").then((res) => {
        console.log(res.data);
        if (res.data.error) {
          setLoading(false);
          return;
        }
        setDocsList([...res.data.docs]);
        setLoading(false);
        return;
      });
    };
    getAllDocs();
  }, []);

  return (
    <div className="container">
      {showDialog ? <Dialog closeDialog={closeDialog} /> : null}
      {loading ? <Loader /> : null}
      <div className="newFile_Container">
        <div className="newFile__card">
          {/* <div className="newFile__icon_contaier">
            <p className="newFile__icon_contaier">+</p>
          </div> */}
          <button className="newFile__label" onClick={openDialog}>
            <AiOutlineFileAdd id="newFile__icon" />
            Create New Document
          </button>
        </div>
      </div>

      {/* section to display all the previous files */}
      <div className="list">
        <div className="header">
          <p className="heading">All Files</p>

          {/* displaying list of all files */}
        </div>
        <div className="search">
          <AiOutlineSearch id="search__icon" />
          <input
            type="text"
            className="search__input"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <AiOutlineClose
            id="search__icon--cancel"
            onClick={() => setSearchText("")}
          />
        </div>

        {docsList?.length === 0 ? (
          <div>No Old Docs</div>
        ) : (
          docsList
            ?.filter((item) => {
              return item.documentName
                .toLowerCase()
                .includes(searchText.toLocaleLowerCase());
            })
            .map((item, i) => {
              return renderDocListItem(item, i);
            })
        )}
      </div>
    </div>
  );
}

export default FilesPage;
