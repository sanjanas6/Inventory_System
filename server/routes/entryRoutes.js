const express = require("express");
const router = express.Router();
const Entry = require("../models/Entry");

// CREATE
router.post("/", async (req, res) => {
  const entry = new Entry(req.body);
  await entry.save();
  res.json(entry);
});

// GET ALL
router.get("/", async (req, res) => {
  const data = await Entry.find().sort({ createdAt: -1 });
  res.json(data);
});

// GET ONE
router.get("/:id", async (req, res) => {
  const data = await Entry.findById(req.params.id);
  res.json(data);
});

// UPDATE (generic)
router.put("/:id", async (req, res) => {
  const updated = await Entry.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

module.exports = router;