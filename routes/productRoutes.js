const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createProduct,
  updateProduct,
  getProduct,
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");

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

const router = express.Router();

router.post("/create-product/:jobId", upload.array("files", 4), createProduct);

router.patch("/update-product/:jobId", upload.array("files", 4), updateProduct);

router.get("/get-product/:jobId", getProduct);

module.exports = router;
