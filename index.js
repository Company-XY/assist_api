const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const botRoutes = require("./routes/botRoutes");
const jobRoutes = require("./routes/test");
const consultationRoutes = require("./routes/consultationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");
const bidRoutes = require("./routes/bidRoutes");
const callRoutes = require("./routes/callRoutes");
const detailsRoutes = require("./routes/detailsRoutes");
const productRoutes = require("./routes/productRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = process.env.PORT || 7000;
const URL = process.env.MONGO_URI;

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

app.use("/api/v1", userRoutes);
app.use("/api/v1", botRoutes);
app.use("/api/v1", jobRoutes);
app.use("/api/v1", consultationRoutes);
app.use("/api/v1", paymentRoutes);
app.use("/api/v1", mpesaRoutes);
app.use("/api/v1", bidRoutes);
app.use("/api/v1", callRoutes);
app.use("/api/v1", detailsRoutes);
app.use("/api/v1", productRoutes);
app.use("/api/v1", ratingRoutes);
app.use("/api/v1", uploadRoutes);

module.exports = app;
