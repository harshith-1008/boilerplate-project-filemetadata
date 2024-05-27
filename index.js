require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use("/public", express.static(path.join(__dirname, "public")));

const isServerless = !!process.env.VERCEL;
const uploadDirectory = isServerless ? "/tmp/" : "temp/";

const upload = multer({ dest: uploadDirectory });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  if (!req.file) {
    return res.json({ error: "no file found" });
  }

  const { originalname, mimetype, size } = req.file;

  const response = {
    name: originalname,
    type: mimetype,
    size: size,
  };

  res.json(response);

  fs.unlink(req.file.path, (err) => {
    //logic to delete from temporary storage
    if (err) {
      console.error("error deleting:", err);
    } else {
      console.log("file deleted successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
