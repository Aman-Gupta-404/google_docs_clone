const express = require("express");
const {
  createDocument,
  deleteDoc,
  getAllDocs,
} = require("../controller/document");
const router = express.Router();

router.post("/delete/", deleteDoc);

router.get("/get", getAllDocs);

module.exports = router;
