// routes/fileRoutes.js
const express = require("express");
const router = express.Router();
const { uploadFile, getFile } = require("../controllers/uploadController");

// Upload a file
router.post("/upload", uploadFile);

// Download a file
router.get("/download/:fileId", getFile);

module.exports = router;
