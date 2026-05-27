const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB Connected"))
  .catch(err => console.log("DB Error:", err));

const entryRoutes = require("./routes/entryRoutes");

app.use("/api/entries", entryRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/health", (req, res) => {
  res.status(200).send("Server alive");
});

app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`)
);