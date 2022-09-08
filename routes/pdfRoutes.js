const express = require("express");
const pdfController = require("../controllers/pdfController");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "store/" });

router.post("/merge", upload.single("image"), pdfController.mergePdf);

module.exports = router;
