const express = require("express");
const { uploadFile, getFile } = require("../controllers/uploadController");

const router = express.Router();
router.post("/upload", uploadFile);

router.get("/download/:fileId", getFile);

module.exports = router;
