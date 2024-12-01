const express = require("express");
const path = require("path");
const router = express.Router();

router.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/login.html"));
});

router.get("/home.html", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/home.html"));
});

module.exports = router;
