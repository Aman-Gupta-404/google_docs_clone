import { useEffect, useState, useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router";

const SAVE_INTERVAL_MS = 2000;

const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ["clean"], // remove formatting button
];

function Editor() {
  const { id: documentId, name: documentName } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", { documentId, documentName });
  }, [socket, quill, documentId]);

  useEffect(() => {
    // connecting to socket io
    // const s = io("http://localhost:9000/", {
    const s = io("https://google-docs-clone-hy6f.onrender.com/", {
      //change it to http://localhost:9000/ in local deployment
      withCredentials: true,
    });
    setSocket(s);
    // console.log("conection stat: ", socket);
    return () => {
      s.disconnect();
    };
  }, []);

  // function to set up the toolbar of the text editor
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innterHTML = "";

    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    }); // First matching element will be use
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);

  // useEffect to handle changes and send the changes to the server
  useEffect(() => {
    console.log("entered this effect: ", socket, quill);
    if (socket == null || quill == null) return;

    function handler(delta, oldDelta, source) {
      console.log(source);
      if (source !== "user") return;
      console.log("emitting");
      socket.emit("send-changes", delta);
    }

    // quill.on("text-change", handler);

    quill.on("text-change", function (delta, oldDelta, source) {
      console.log(source);
      if (source !== "user") return;
      console.log("emitting");
      socket.emit("send-changes", delta);
    });

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  // to handle the changes made by other user (changes coming via socket.io)
  useEffect(() => {
    console.log("entered this effect: ", socket, quill);
    if (socket == null || quill == null) return;

    function handler(delta, oldDelta, source) {
      quill.updateContents(delta);
    }

    // quill.on("text-change", handler);

    socket.on("recieve-changes", function (delta) {
      quill.updateContents(delta);
    });

    return () => {
      socket.off("recieve-changes", handler);
    };
  }, [socket, quill]);

  // use effect to save the document updates
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  return <div className="container" ref={wrapperRef}></div>;
}

export default Editor;
