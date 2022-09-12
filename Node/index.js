const express = require("express");
const bodyParser = require("body-parser");
const pdfRoutes = require("./routes/pdfRoutes");
const path = require("path");




const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const download = require("download");
var url = require("url");


// Import Cors
const cors = require("cors");

let dotenv = require("dotenv");
dotenv.config();
// Initialise the app
let app = express();

// Cors Policy
app.use(
  cors({
    origin: "*",
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../React/build')));
app.use("/store", express.static(path.join(__dirname, "store")));

// Setup server port
var port = process.env.PORT || 3001;

app.use(pdfRoutes);
   
// Send message for default URL
app.get("/try1", (req, res) => res.send("Hello World with Express"));
app.post("/try2", (req, res) =>{
  const data=req.body.jobNumber
 
  res.status(200).send({ message: 'Only POST requests allowed',v:data})
});



app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../React/build', 'index.html'));
});

app.listen(port, function () {
  console.log("Running Pdf Generator on " + `http://localhost:${port}`);
});
