const express = require("express");
const pdfController = require("../controllers/pdfController");
const router = express.Router();

router.post("/merge", pdfController.mergePdf);

module.exports = router;
