const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");
const fs = require("fs");
const download = require("download");
const path = require("path");
var url = require("url");

let self = {};

const tempPdfFilesDirectoryPath = "./pdfFiles";

// Merge Pdf With Final Result
self.mergePdf = async (req, res, next) => {
  var str = req.body;
  const mergedPdf = await PDFDocument.create();
  const jobNumber = req.body.jobNumber;
  const notes = req.body.Notes;
  const notesLength = notes.replace(/(.{70})/g, "$1\n");
  // Checking if the image is received.

  if (req.file) {
    var image = req.file.filename;
    var imageBuffer = fs.readFileSync(`./store/${image}`);
  }

  var timeStamp = Date.now();
  var tempFile = jobNumber;
  var fileName = `${tempFile}_${timeStamp}.pdf`;

  // Checking if store directory is there. If store is not there make new store directory.
  var dir = "./store";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  // Making url for resulting pdf.
  var pathToPdf = path.join(__dirname, "..", "store", fileName);
  const finalUrl = new URL(
    `./store/${fileName}`,
    `${req.protocol}://${req.get("host")}${req.originalUrl}`
  ).href;

  try {
    var data = str;

    // Downloading the pdfs to be merged in tempFiles directory.
    for (let file of Object.entries(data.PackageDetails)) {
      try {
        await download(file[1].url, tempPdfFilesDirectoryPath);
      } catch (error) {
        console.log(error);
        fs.unlink(path.join(pathToPdf), (err) => {
          if (err) {
            console.log(err);
          }
        });
        return res.status(400).json({
          error: error.statusMessage,
          message:
            "Can not download the file. Make sure the file is available and format is in Pdf.",
        });
      }

      try {
        const pdfFileName = path.win32.basename(file[1].url);

        const uint8Array = fs.readFileSync(
          `${tempPdfFilesDirectoryPath}/${pdfFileName}`
        );
        const pdfFile = await PDFDocument.load(uint8Array);
        const totalPages = pdfFile.getPageCount();
        for (let index = 0; index < totalPages; index++) {
          if (image) {
            const page = pdfFile.getPage(index);
            const img = await pdfFile.embedJpg(imageBuffer);
            const { width, height } = img.size();
            const scale = img.scale(0.15);

            page.drawImage(img, {
              x: page.getWidth() - 110,
              y: 15,
              height: 40,
              width: 100,
            });
          }
          if (jobNumber) {
            const courierBoldFont = await pdfFile.embedFont(
              StandardFonts.Courier
            );
            const textWidthJobNumber = courierBoldFont.widthOfTextAtSize(
              jobNumber,
              8
            );
            const page = pdfFile.getPage(index);
            page.drawRectangle({
              x: 15,
              y: page.getHeight() - page.getHeight() + 15,
              height: 40,
              width: 65,
              borderWidth: 1.5,
              borderOpacity: 0.3,
              borderColor: rgb(0, 0, 0),
            });
            page.moveTo(20, 40);
            page.drawText(`Job Number:`, {
              font: courierBoldFont,
              size: 8,
              lineHeight: 10,
              center: 1,
            });
            page.moveDown(10);
            page.drawText(jobNumber, {
              x: 45 - textWidthJobNumber / 2,
              font: courierBoldFont,
              size: 8,
              lineHeight: 10,
              center: 1,
            });
          }
          if (notes) {
            const courierBoldFont = await pdfFile.embedFont(
              StandardFonts.Courier
            );
            const page = pdfFile.getPage(index);

            page.drawRectangle({
              x: 93,
              y: page.getHeight() - page.getHeight() + 15,
              height: 40,
              width: 400,
              borderWidth: 1.5,
              borderOpacity: 0.3,
              borderColor: rgb(0, 0, 0),
            });
            page.moveTo(100, 40);
            page.drawText(notesLength, {
              font: courierBoldFont,
              size: 9,
              left: 0,
              lineHeight: 9,
            });
          }
        }
        const copiedPages = await mergedPdf.copyPages(
          pdfFile,
          pdfFile.getPageIndices()
        );
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        const mergedPdfFile = await mergedPdf.save();

        console.log(
          `Storing Merge File - ${tempPdfFilesDirectoryPath}/${pdfFileName}`
        );
        fs.writeFileSync(pathToPdf, mergedPdfFile);

        fs.unlinkSync(`${tempPdfFilesDirectoryPath}/${pdfFileName}`);
        console.log(
          `Deleted Merged temproray file - ${tempPdfFilesDirectoryPath}/${pdfFileName}`
        );
      } catch (error) {
        console.log(error);
        fs.unlink(path.join(pathToPdf), (err) => {
          if (err) {
            console.log(err);
          }
        });
        return res.status(400).json({
          error: error,
          message: "Error while merging Pdf.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    fs.unlink(path.join(pathToPdf), (err) => {
      if (err) {
        console.log(err);
      }
    });
    return res.status(400).json({
      error: error,
      message: "Error while creating Pdf.",
    });
  }
  if (req.file) {
    fs.unlinkSync(path.join(__dirname, "..", "store", image));
  }
  console.log(`Operation Completed, sending response`);
  res.status(200).json({
    path: finalUrl,
    filename: fileName,
  });
};

module.exports = self;
