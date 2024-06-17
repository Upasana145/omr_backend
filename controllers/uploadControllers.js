const { query } = require("../db/db.js");
const { getISODate } = require("../utils/dateFormat.js");
const HTML_TEMPLATE = require("../utils/mail-template.js");
const SENDMAIL = require("../utils/mailSend.js");
const { resSend } = require("../utils/resSend");
const xlsx = require("xlsx");
const { mailControllerindividual } = require("./mailControllers.js");

exports.uploadFile = (req, res) => {
  // Handle Image Upload
  let fileData = {};
  if (req.file) {
    fileData = {
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    };
    console.log("hey i am file data:", req.body.text);
    // console.log("hey i am text data:", req.text);

    resSend(res, true, 200, "file uploaded!", fileData, null);
  } else {
    resSend(res, false, 200, "Please upload a valid image", fileData, null);
  }
};

// exports.exceluploadFile = (req, res) => {
//   // Handle Image Upload
//   let fileData = {};
//   if (req.file) {
//     fileData = {
//       fileName: req.file.filename,
//       filePath: req.file.path,
//       fileType: req.file.mimetype,
//       fileSize: req.file.size,
//     };
//     console.log("hey i am file data:", fileData);

//     let workbook = xlsx.readFile("fileData.filePath");
//     console.log("Hey i am work book sheet", workbook);
//     // // console.log("Hey i am work book sheet name", workbook.SheetNames[0]);

//     // let worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     // // console.log("Hey i am worksheet....", workbook);

//     // let range = xlsx.utils.decode_range(worksheet["!ref"]);
//     // // console.log("rangeeeeeeeeee", range);
//     // for (let row = range.s.r; row <= range.e.r; row++) {
//     //   let data = [];
//     //   for (let col = range.s.c; col <= range.e.c; col++) {
//     //     let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
//     //     // console.log("hey i am celll", cell);
//     //   }
//     // }

//     resSend(res, true, 200, "file uploaded!", fileData, null);
//   } else {
//     resSend(res, false, 200, "Please upload a valid image", fileData, null);
//   }
// };

exports.exceluploadFile = (req, res) => {
  // Handle Excel file Upload
  let fileData = {};

  if (req.file) {
    fileData = {
      fileName: req.file.filename,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    };
    console.log("Uploaded file data:", fileData);

    // Read the uploaded Excel file
    let workbook = xlsx.readFile(fileData.filePath);
    console.log("Excel workbook:", workbook);
    // console.log("Hey i am work book sheet", workbook.Sheets);
    // console.log("Hey i am work book sheet name", workbook.SheetNames[0]);

    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log("Hey i am worksheet....", workbook);

    let range = xlsx.utils.decode_range(worksheet["!ref"]);
    // console.log("rangeeeeeeeeee", range);
    for (let row = range.s.r; row <= range.e.r; row++) {
      let data = [];
      for (let col = range.s.c; col <= range.e.c; col++) {
        let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
        // console.log("hey i am celll", cell);
        if (cell) {
          data.push(cell.v);
        } else {
          data.push("");
        }
      }

      console.log("Hey i am data...", data);
      let SQL = `INSERT INTO employee (NGS,name,birthday,anniversary,employee_email,senior_email,hr_email)
      VALUES(?,?,?,?,?,?,?)`;
      const result = query({
        query: SQL,
        values: data,
      });
    }

    res.send({
      success: true,
      message: "Excel file uploaded!",
      fileData: fileData,
      workbook: workbook,
    });
  } else {
    res.status(400).send({
      success: false,
      message: "Please upload a valid Excel file",
      fileData: fileData,
    });
  }
  // if (req.file) {
  //   fileData = {
  //     fileName: req.file.filename,
  //     filePath: req.file.path,
  //     fileType: req.file.mimetype,
  //     fileSize: req.file.size,
  //   };
  //   console.log("Uploaded file data:", fileData);

  //   // Read the uploaded Excel file
  //   let workbook = xlsx.readFile(fileData.filePath);
  //   console.log("Excel workbook:", workbook);
  //   // console.log("Hey i am work book sheet", workbook.Sheets);
  //   // console.log("Hey i am work book sheet name", workbook.SheetNames[0]);

  //   let worksheet = workbook.Sheets[workbook.SheetNames[0]];
  //   // console.log("Hey i am worksheet....", workbook);

  //   let range = xlsx.utils.decode_range(worksheet["!ref"]);
  //   // console.log("rangeeeeeeeeee", range);
  //   for (let row = range.s.r; row <= range.e.r; row++) {
  //     let data = [];
  //     for (let col = range.s.c; col <= range.e.c; col++) {
  //       let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
  //       // console.log("hey i am celll", cell);
  //       if (cell) {
  //         data.push(cell.v);
  //       } else {
  //         data.push("");
  //       }
  //     }
  //     // // console.log(data);
  //     // let SQL = `INSERT INTO employee (NGS,name,why_special,employee_email,senior_email,hr_email)
  //     // VALUES(?,?,?,?,?,?)`;
  //     // const result = query({
  //     //   query: SQL,
  //     //   values: data,
  //     // });
  //     console.log("Hey i am data...", data);
  //     let SQL = `INSERT INTO employee (NGS,name,birthday,anniversary,employee_email,senior_email,hr_email)
  //     VALUES(?,?,?,?,?,?,?)`;
  //     const result = query({
  //       query: SQL,
  //       values: data,
  //     });
  //   }

  //   res.send({
  //     success: true,
  //     message: "Excel file uploaded!",
  //     fileData: fileData,
  //     workbook: workbook,
  //   });
  // } else {
  //   res.status(400).send({
  //     success: false,
  //     message: "Please upload a valid Excel file",
  //     fileData: fileData,
  //   });
  // }
};

exports.saveImgToDB = async (req, res) => {
  const { dept_name, camera, image, alarm_type } = req.body;
  // console.log("hey i am req.body", req.body);
  // let image = req.file;
  const currentDate = new Date();
  // Set the time zone offset for IST, which is UTC+5:30
  const istOffset = 330; // 5 hours and 30 minutes
  currentDate.setMinutes(currentDate.getMinutes() + istOffset);
  const datetime = currentDate.toISOString();

  try {
    let sql = `SELECT * FROM depts WHERE dept_name= '${dept_name}'`;

    const result = await query({
      query: sql,
      values: [],
    });
    // console.log("hey i am depts details", result);
    let sql3 = `SELECT * FROM mail_log`;

    const result3 = await query({
      query: sql3,
      values: [],
    });
    // console.log("hey i am sql3 details", result3);

    let sql2 = `SELECT emails FROM depts WHERE dept_name= '${dept_name}'`;

    const result2 = await query({
      query: sql2,
      values: [],
    });
    // console.log("hey i am depts details", result2[0].emails);

    if (result && result.length > 0) {
      let dept_id = result[0]?.dept_id;
      let sql = `INSERT INTO alarm (dept_id, camera, alarm_type, image, datetime) VALUES ('${dept_id}', '${camera}', '${alarm_type}', '${image}', '${datetime}')`;
      let sql2 = `INSERT INTO mail_log (body, is_sent, datetime, emails) VALUES ('${JSON.stringify(
        req.body
      )}', 0, '${datetime}', '${JSON.stringify(result2[0].emails)}' )`;
      const re = await query({
        query: sql,
        values: [],
      });
      const re2 = await query({
        query: sql2,
        values: [],
      });

      resSend(res, true, 200, "Data saved!", re, null);

      // mail send
      // let time = datetime.split("T")[1].slice(0, 5);

      // let date = new Date(datetime).toLocaleDateString("en", {
      //   weekday: "long",
      //   year: "numeric",
      //   month: "long",
      //   day: "numeric",
      // });

      // let mailDetails = {
      //   from: "safety.sudisafoundry@gmail.com",
      //   to: result[0]?.emails,
      //   subject: "The staff is not wearing the safety helmet",
      //   html: HTML_TEMPLATE(req.body, date, time),
      //   attachments: [
      //     {
      //       filename: image,
      //       path: `uploads/${image}`,
      //     },
      //   ],
      // };
      // SENDMAIL(mailDetails, function (err, data) {
      //   if (!err) {
      //     console.log("Error Occurs", err);
      //   } else {
      //     console.log("Email sent successfully");
      //   }
      // });
    } else {
      resSend(
        res,
        false,
        200,
        "Dept doesn't exist! No Record Found!",
        result,
        null
      );
    }
  } catch (error) {
    console.log(error);
    resSend(res, false, 400, "Error", error, null);
  }
};

// for sending mail containing image and text

// exports.sendimgtext = (req, res) => {
//   // Handle Image Upload
//   let fileData = {};
//   if (req.file) {
//     fileData = {
//       fileName: req.file.filename,
//       filePath: req.file.path,
//       fileType: req.file.mimetype,
//       fileSize: req.file.size,
//     };

//     const { ngs } = req.body;
//     const { file } = req;

//     console.log("Heyy i am NGS...", ngs);
//     // console.log("Heyy i am FILE...", file);

//     // console.log("hey i am file ngs:", req.body.ngs);
//     // console.log("hey i am file text:", req.body.text);
//     // console.log("hey i am file text:", req.file);

//     // console.log("hey i am text data:", req.text);

//     resSend(res, true, 200, "file uploaded!", fileData, null);
//   } else {
//     resSend(res, false, 200, "Please upload a valid image", fileData, null);
//   }
// };

// Again above:-
exports.imagepathandname = async (req, res) => {
  // Handle Image Upload

  try {
    const { name } = req.body;
    console.log("Heyy i am NGS...", name);
    const { file } = req;
    console.log("Heyy i am file...", file);

    let sql = `SELECT * FROM employee where NGS = '${name}'`;
    const result2 = await query({
      query: sql,
      values: [],
    });
    if (result2 && result2.length > 0) {
      // If employee with given NGS exists
      await mailControllerindividual(result2[0]); // Pass the employee details to mailController function
      res.send("MailController function called!");
    } else {
      res.send("No employee found with provided NGS.");
    }
  } catch (error) {
    console.log(error);
    resSend(res, false, 400, "Error", error, null);
  }
};

// mrinmoy code
// const { query } = require("../db/db.js");
// const { getISODate } = require("../utils/dateFormat.js");
// const HTML_TEMPLATE = require("../utils/mail-template.js");
// const SENDMAIL = require("../utils/mailSend.js");
// const { resSend } = require("../utils/resSend");

// exports.uploadFile = (req, res) => {
//   // Handle Image Upload
//   let fileData = {};
//   if (req.file) {
//     fileData = {
//       fileName: req.file.filename,
//       filePath: req.file.path,
//       fileType: req.file.mimetype,
//       fileSize: req.file.size,
//     };
//     resSend(res, true, 200, "file uploaded!", fileData, null);
//   } else {
//     resSend(res, false, 200, "Please upload a valid image", fileData, null);
//   }
// };

// exports.saveImgToDB = async (req, res) => {
//   const { dept_name, camera, image, alarm_type } = req.body;
//   console.log("hey i am req.body", req.body);
//   // let image = req.file;
//   const currentDate = new Date();
//   // Set the time zone offset for IST, which is UTC+5:30
//   const istOffset = 330; // 5 hours and 30 minutes
//   currentDate.setMinutes(currentDate.getMinutes() + istOffset);
//   const datetime = currentDate.toISOString();

//   try {
//     let sql = `SELECT * FROM depts WHERE dept_name= '${dept_name}'`;

//     const result = await query({
//       query: sql,
//       values: [],
//     });

//     if (result && result.length > 0) {
//       let dept_id = result[0]?.dept_id;
//       let sql = `INSERT INTO alarm (dept_id, camera, alarm_type, image, datetime) VALUES ('${dept_id}', '${camera}', '${alarm_type}', '${image}', '${datetime}')`;
//       let sql2 = `INSERT INTO mail_log (body, is_sent, datetime) VALUES ('${JSON.stringify(
//         req.body
//       )}', 0, '${datetime}')`;
//       const re = await query({
//         query: sql,
//         values: [],
//       });
//       const re2 = await query({
//         query: sql2,
//         values: [],
//       });

//       resSend(res, true, 200, "Data saved!", re, null);

//       // mail send
//       let time = datetime.split("T")[1].slice(0, 5);

//       let date = new Date(datetime).toLocaleDateString("en", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });

//       // let mailDetails = {
//       //   from: "safety.sudisafoundry@gmail.com",
//       //   to: result[0]?.emails,
//       //   subject: "The staff is not wearing the safety helmet",
//       //   html: HTML_TEMPLATE(req.body, date, time),
//       //   attachments: [
//       //     {
//       //       filename: image,
//       //       path: `uploads/${image}`,
//       //     },
//       //   ],
//       // };
//       // SENDMAIL(mailDetails, function (err, data) {
//       //   if (!err) {
//       //     console.log("Error Occurs", err);
//       //   } else {
//       //     console.log("Email sent successfully");
//       //   }
//       // });
//     } else {
//       resSend(
//         res,
//         false,
//         200,
//         "Dept doesn't exist! No Record Found!",
//         result,
//         null
//       );
//     }
//   } catch (error) {
//     console.log(error);
//     resSend(res, false, 400, "Error", error, null);
//   }
// };
