const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Files = require("./Models/filesModel");
const fs = require("fs").promises;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

const PORT = 7000;
const URL =
  "mongodb+srv://assist-africa-2023:assist-africa-2023@assistafrica.cztt7ma.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(URL)
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        `Mongo DB Connected Successfully & Server running on Port ${PORT}`
      )
    );
  })
  .catch((error) => console.log({ message: error.message }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/Images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

app.post("/upload", upload.single("file"), async (req, res) => {
  Files.create({ name: req.file.filename })
    .then((result) => res.json(result))
    .catch((error) => console.log(error));
});

app.get("/image", async (req, res) => {
  Files.find()
    .then((response) => res.json(response))
    .catch((error) => res.json(error));
});

app.get("/image/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Files.findById(id);
    res.status(200).json(image);
  } catch (error) {
    console.log(error);
  }
});

app.get("/download/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const file = await Files.findById(id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    const filename = file.name;
    const filePath = path.join(__dirname, "public/Images", filename);

    const fileData = await fs.readFile(filePath);

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    res.status(200).end(fileData);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Server error" });
  }
});
