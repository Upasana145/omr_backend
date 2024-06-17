const express = require("express");
const {
  uploadFile,
  saveImgToDB,
  testUpload,
  exceluploadFile,
  imagepathandname,
} = require("../controllers/uploadControllers");
const { upload } = require("../utils/fileUpload");
const router = express.Router();

router.post("/", upload.single("excel"), exceluploadFile);
router.post("/images", upload.single("image"), uploadFile);
router.post("/imagepathandname", upload.single("image"), imagepathandname);

// router.post("/image", upload.single("text"), uploadFile);
// router.post("/save", saveImgToDB);
// router.post("/test", upload.single("image"), testUpload);

module.exports = router;
