const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads");
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now();
//     cb(null, uniqueSuffix + "-" + file.originalname);
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const userFilename = req.body.filename;
    console.log("hey i am userFilename...", userFilename);
    if (userFilename) {
      cb(null, userFilename);
    } else {
      // Fallback to using the original filename if no user filename is provided
      cb(null, Date.now() + "-" + file.originalname);
    }
  },
});
// Specify file format that can be saved
function fileFilter(req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, jpg and png files are allowed!"), false);
  }
}

// file limits
// let maxSize = 1 * 1024 * 1024;
// function limits(req, file, cb) {
//   // cb({
//   //   fieldNameSize: 255,
//   //   fileSize: maxSize,
//   //   files: 1,
//   //   fields: 1,
//   // });
//   { fileSize: 5 * 1000 * 1000 }
//   cb(new Error("File should be below 250kb"), false);
// }

const upload = multer({
  storage: storage,
});

module.exports = { upload };
