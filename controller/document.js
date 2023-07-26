const Document = require("../models/document");

const createDocument = (req, res) => {
  res.json({
    message: "this works",
  });
};

const deleteDoc = async (req, res) => {
  const documetnId = req.body._id;

  try {
    const deletedDoc = await Document.findByIdAndDelete({ documetnId });
    return res.status(200).json({
      error: false,
      message: "Deletion successfull!",
    });
  } catch (error) {
    return res.status(403).json({
      error: true,
      message: "some error occured!",
    });
  }
};

const getAllDocs = async (req, res) => {
  try {
    const allDocs = await Document.find();

    return res.status(200).json({
      error: false,
      docs: allDocs,
    });
  } catch (error) {}
};
module.exports = { createDocument, deleteDoc, getAllDocs };
