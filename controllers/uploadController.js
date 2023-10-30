const File = require("../models/uploadModel");
const { uploadToBackblazeB2 } = require("../utils/backblaze");

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded..." });
    }

    const file = req.file;

    // Upload the file to Backblaze B2
    const { url, fileId } = await uploadToBackblazeB2(file);

    // Save file information to the database
    const uploadedFile = new File({
      filename: file.originalname,
      downloadLink: url,
    });

    await uploadedFile.save();

    res.json({ file: uploadedFile });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: "File upload failed" });
  }
};

exports.getFile = async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.redirect(file.downloadLink);
  } catch (err) {
    console.error("Error getting file:", err);
    res.status(500).json({ error: "Error getting file" });
  }
};
