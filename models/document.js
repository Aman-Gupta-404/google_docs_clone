const mongoose = require("mongoose");

const documentModalSchema = new mongoose.Schema({
  _id: String,
  documentName: String,
  data: Object,
});

const Document = mongoose.model("Document", documentModalSchema);

module.exports = Document;
