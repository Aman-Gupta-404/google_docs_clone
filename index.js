const express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const Document = require("./models/document");

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
connectDB();

// creating the end points
const documentRoutes = require("./routes/documentRoutes");
app.use("/api/v1/document", documentRoutes);

// ------------------------deployment---------------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  console.log("running the production version!");
  app.use(express.static(path.join(__dirname1, "/client/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API running successfully");
  });
}
// ------------------------deployment---------------------------------

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

const PORT = 9000 || process.env.PORT;
const server = app.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});

// ------------------ code for socket io------------------
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    // origin: false,
    // credentials: true,
  },
});
// socket io functions
io.on("connection", (socket) => {
  console.log("connected", socket);
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
