const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// FIXED CONNECTION
mongoose.connect(process.env.MONGO_URI, {
})
    .then(() => console.log("DB Connected"))
    .catch(err => console.log("DB Error:", err));
app.get("/", (req, res) => {
    res.send("API Running");
});

app.listen(5000, () => console.log("Server running on 5000"));

const entryRoutes = require("./routes/entryRoutes");

app.use("/api/entries", entryRoutes);