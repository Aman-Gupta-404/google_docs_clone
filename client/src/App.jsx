import { useState } from "react";
import "./App.css";
import Editor from "./components/Editor/Editor";
import { Route, Routes, Navigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Redirector from "./components/Redirector";
import FilesPage from "./pages/FilesPage/FilesPage";
import Loader from "./components/Loader/Loader";

function App() {
  return (
    <Routes>
      {/* <Route path="/" exact Component={Redirector} /> */}
      <Route path="/" exact Component={FilesPage} />
      <Route path="/test" exact Component={Loader} />

      <Route path="/document/:id/:name" Component={Editor} />
      {/* <Editor /> */}
    </Routes>
  );
}

export default App;
