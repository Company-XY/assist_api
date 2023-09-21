const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const botRoutes = require("./routes/botRoutes");
const jobRoutes = require("./routes/jobRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");

const app = express();
app.use(cors());
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

module.exports = app;
