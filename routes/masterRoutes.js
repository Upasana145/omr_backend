const express = require("express");
const {
  fetchAlerts,
  getEmp,
  addEmp,
  editEmp,
  deleteEmp,
  fetchEmp,
  excelEmp,
  sendEmailcronjob,
  sendEmail,
  readomrData,
  insertomrData,
  editomrData,
  deleteomrData,
  allomrData,
} = require("../controllers/masterControllers");
const router = express.Router();

router.get("/emp", getEmp);
router.post("/emp", addEmp);

router.post("/emp/edit", editEmp);
router.get("/emp/excel", excelEmp);
// /dept1/delete
router.post("/emp/delete", deleteEmp);
router.post("/mailsend", sendEmail);

router.post("/mailsendcronjob", sendEmailcronjob);
router.get("/emp/fetch", fetchEmp);

router.post("/fetchAlerts", fetchAlerts);

// CRUD operation in OMR sheet
// Read
// router.get("/readomrData", readomrData);
router.get("/alldata", allomrData);
router.post("/readomrData", readomrData);

// Insert
router.post("/insertomrData", insertomrData);
// Edit
router.post("/editomrData", editomrData);
// Delete
router.post("/deleteomrData", deleteomrData);

module.exports = router;
