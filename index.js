const express = require("express");
const QRCode = require("qrcode");
const cors = require("cors");
const bwipjs = require("bwip-js");
const app = express();
const port = 3001;
app.use(cors());
// GET /generate-qr?data=YourTextHere

app.get("/generate-barcode", (req, res) => {
  const {
    name,
    class: cls,
    section,
    // phone,
    // fatherName,
    // address,
  } = req.query;

  if (!name || !cls || !section) {
    return res.status(400).send("Missing one or more required fields");
  }

//   const barcodeData =
//     `name: ${name}\n` +
//     `class: ${cls}\n` +
//     `section: ${section}\n` +
//     `phone: ${phone}\n` +
//     `fatherName: ${fatherName}\n` +
//     `address: ${address}`;

    const barcodeData =
    `${name}-` + 
    `${cls}-` + 
    `${section}`;

  bwipjs.toBuffer(
    {
        bcid: 'code128',
        text: barcodeData,
        scale: 0.5,
        height: 10,
        includetext: true,
        textxalign: 'center',
        textsize: 10,
    },
    (err, pngBuffer) => {
      if (err) {
        console.error("Barcode generation error:", err);
        return res.status(500).send("Barcode generation failed");
      }

      // Embed barcode in browser page
      const base64Image = pngBuffer.toString("base64");
      const html = `
        <html>
          <body style="text-align:center; margin-top:50px;">
            <h3>Barcode</h3>
            <img src="data:image/png;base64,${base64Image}" />
            <p>Right-click to copy or save</p>
          </body>
        </html>
      `;
      res.send(html);
    }
  );
});

app.listen(port, () => {
  console.log(`QR Code Generator running at http://localhost:${port}`);
});
