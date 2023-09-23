const multer = require("multer");

const storage = multer.memoryStorage();

const allowedFileTypes = [
  "image/",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (allowedFileTypes.some((type) => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images, PDFs, DOCX, Excel, and PowerPoint files are allowed."
        ),
        false
      );
    }
  },
});

module.exports = upload;
