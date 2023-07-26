const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
var cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const Document = require("./models/document");
// settign up the dot env configuration
const dotenv = require("dotenv");
dotenv.config();
const PORT = 9000;

app.use(cors());
// connecting the database
connectDB();

// creating socket io connection
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// accessing static files
app.use(express.static(path.join(__dirname, "./client/dist")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

// default valur for the document
const defaultValue = "";

// function to create document
const findOrCreateDoc = async (id, name) => {
  if (id == null) return;

  const document = await Document.findById(id);

  if (document) return document;

  return await Document.create({
    _id: id,
    documentName: name,
    data: defaultValue,
  });
};

// creating the end points
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/v1/document", documentRoutes);

// socket io functions
io.on("connection", (socket) => {
  console.log("connected");
  // function to get the document data
  socket.on("get-document", async (document) => {
    const _document = await findOrCreateDoc(
      document.documentId,
      document.documentName
    );
    socket.join(document.documentId);
    socket.emit("load-document", _document.data);

    socket.on("send-changes", (delta) => {
      // console.log(delta);
      socket.broadcast.to(document.documentId).emit("recieve-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(document.documentId, { data });
    });
  });
});

server.listen(PORT, () => {
  console.log("listening on *:3000");
});
