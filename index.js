const express = require("express");
const bodyParser = require("body-parser");
const pdfRoutes = require("./routes/pdfRoutes");
const path = require("path");


//try
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
app.use("/store", express.static(path.join(__dirname, "store")));

// Setup server port
var port = process.env.PORT || 3000;

app.use(pdfRoutes);

// Send message for default URL
app.get("/", (req, res) => res.send("Hello World with Express"));
app.get("/try1",(req,res)=>{
 (fs.readFile('controllers/pdfController.js',null,(err,data)=>res.send(data)))
})
app.get('try2',(req,res)=>{
  let x=download("https://docs2.sbcacomponents.com/sites/default/files/jobsite-cover-sheet_3.pdf")
  res.send(x)
})
app.listen(port, function () {
  console.log("Running Pdf Generator on " + `http://localhost:${port}`);
});
