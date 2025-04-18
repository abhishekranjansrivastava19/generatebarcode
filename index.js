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
    session,
    phone,
    fatherName,
    scholarno,
  } = req.query;

  if (
    !name ||
    !fatherName ||
    !cls ||
    !section ||
    !session ||
    !scholarno ||
    !phone
  ) {
    return res.status(400).send("Missing one or more required fields");
  }


  const first4Name = name.trim().toUpperCase().substring(0, 4);
  const last5Phone = phone.trim().slice(-5);
  const barcodeData = `${scholarno}${first4Name}${last5Phone}`;

  bwipjs.toBuffer(
    {
      bcid: "code128",
      text: barcodeData,
      scale: 1,
      height: 10,
      includetext: true,
      textxalign: "center",
      textsize: 14,
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
  <body style="font-family: Arial; display: flex; justify-content: center; align-items: center; padding: 10px;">
    <div style="border: 1px solid #000; padding: 10px; text-align: center; width: 350px;">
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 25px;">${cls} (${section}) (${session})</div>
      <div style="font-size: 20px; font-weight: bold; margin-bottom: 4px;">${name.toUpperCase()}</div>
      <div style="font-size: 15px; margin-bottom: 10px;">${fatherName.toUpperCase()}</div>
      <img src="data:image/png;base64,${base64Image}" alt="Barcode" style="width: 100%; height: auto;" />
    </div>
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
