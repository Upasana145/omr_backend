const { resSend } = require("../utils/resSend");
const { query } = require("../db/db.js");
const { dateSqlType } = require("../utils/dateFormat");
const {
  mailController,
  mailControllerindividual,
} = require("./mailControllers.js");
const xlsx = require("xlsx");
const { cronJobStart, cronJobStop } = require("../cron/cron.js");

// GET /api/v1/master/dept
exports.getEmp = async (req, res) => {
  try {
    let sql = `SELECT * FROM employee`;

    const result = await query({
      query: sql,
      values: [],
    });
    console.log(result);
    if (result && result.length > 0) {
      // User exits, check passwords
      resSend(res, true, 200, "Dept list", result, null);
    } else {
      resSend(res, false, 200, "No Record Found!", result, null);
    }
  } catch (error) {
    console.log(error);
    resSend(res, false, 400, "Error", error, null);
  }
};

// POST /api/v1/master/dept
exports.addEmp = async (req, res) => {
  const {
    NGS,
    name,
    birthday,
    anniversary,
    employee_email,
    senior_email,
    hr_email,
  } = req.body;

  if (
    (NGS, name, birthday, anniversary, employee_email, senior_email, hr_email)
  ) {
    try {
      let ngs_count = `select count(NGS) as count from employee where NGS = '${NGS}'`;
      const result1 = await query({
        query: ngs_count,
        values: [],
      });
      console.log("ngs_count:", result1);

      console.log("ngs_count:", result1[0].count);

      if (result1 && result1[0].count < 1) {
        // const specialInfo = []; // Array to store special information

        // specialInfo.push({ type: "BirthDay", date: birthday });
        // specialInfo.push({ type: "Anniversory", date: anniversory });

        // const specialInfoJSON = JSON.stringify(specialInfo); // Convert to JSON string

        // let sql = `INSERT INTO employee(NGS, name, why_special, employee_email, senior_email, hr_email) VALUES ('${NGS}', '${name}', '${specialInfoJSON}', '${employee_email}', '${senior_email}', '${hr_email}')`;
        let sql = `INSERT INTO employee(NGS, name,birthday,anniversary, employee_email, senior_email, hr_email) VALUES ('${NGS}', '${name}', '${birthday}','${anniversary}', '${employee_email}', '${senior_email}', '${hr_email}')`;

        const result = await query({
          query: sql,
          values: [],
        });

        if (result) {
          resSend(res, true, 200, "Dept list", result, null);
        } else {
          resSend(res, false, 200, "No Record Found!", result, null);
        }
      } else {
        resSend(res, false, 200, "NGS already exists", null, null);
      }
    } catch (error) {
      // Handle error
      console.log(error);
      resSend(res, false, 400, "Error", error, null);
    }
  } else {
    resSend(res, false, 200, "Please fill all the inputs", null, null);
  }
};

// POST /api/v1/master/dept/edit

exports.editEmp = async (req, res) => {
  const {
    NGS,
    name,
    birthday,
    anniversary,
    employee_email,
    senior_email,
    hr_email,
  } = req.body;
  try {
    const birthdayISO = new Date(birthday).toISOString();
    console.log("hey i am birthdayISO", birthdayISO);
    const birthday_date = birthdayISO.split("T")[0];

    console.log("birthday_dateeeeee....", birthday_date);
    const anniversaryISO = new Date(anniversary).toISOString();
    console.log("hey i am anniversaryISO", anniversaryISO);
    const anniversary_date = anniversaryISO.split("T")[0];
    console.log("Anniversary dateeeeee...", anniversary_date);

    let ngs_count = `SELECT COUNT(NGS) as count FROM employee WHERE NGS  = '${NGS}'`;
    const result2 = await query({
      query: ngs_count,
      values: [],
    });

    console.log("hey i am result2", result2, NGS);
    console.log("hey i am result2", result2[0].count);

    if (result2 && result2[0].count > 0) {
      const currentDate = new Date().toISOString().slice(0, 10);
      // console.log("hey i am currentdateeeeee...", currentDate);

      // Get current date
      // const specialInfo = []; // Array to store special information

      // if (Birthday) {
      //   specialInfo.push({ birthday: Birthday, date: currentDate });
      // }
      // if ( Anniversary) {
      //   specialInfo.push({ anniversory: Anniversory, date: currentDate });
      // }
      // const specialInfoJSON = JSON.stringify(specialInfo); // Convert to JSON string

      // let sql = `UPDATE employee SET name=?, why_special=?, employee_email=?, senior_email=?, hr_email=? WHERE NGS=?`;

      let sql = `UPDATE employee SET name=?, birthday=?,anniversary=?, employee_email=?,senior_email=?,hr_email=? WHERE NGS=?`;

      const result = await query({
        query: sql,
        values: [
          name,
          // specialInfoJSON,
          // birthday,
          birthday_date,
          anniversary_date,
          employee_email,
          senior_email,
          hr_email,
          NGS,
        ],
      });

      resSend(res, true, 200, "Data Updated", result, null);
    } else {
      resSend(
        res,
        true,
        200,
        "you cann't edit because NGS doesn't exists",
        null,
        null
      );
    }
  } catch (error) {
    console.log(error);
    resSend(res, false, 400, "Error", error, null);
  }
};

// POST /api/v1/master/dept/delete
exports.deleteEmp = async (req, res) => {
  const { NGS } = req.body;
  console.log("Hey i am NGS..", NGS);
  let ngs_count = `SELECT COUNT(NGS) as count FROM employee WHERE NGS = '${NGS}'`;
  const result1 = await query({
    query: ngs_count,
    values: [],
  });

  // console.log("hey i am result: ", result1[0].count);

  if (result1 && result1[0].count > 0) {
    try {
      let sql = `Delete FROM employee WHERE NGS = '${NGS}'`;
      const result = await query({
        query: sql,
        values: [],
      });
      resSend(res, true, 200, "Data deleted successfully", result, null);
    } catch (error) {
      resSend(res, false, 400, "Error", error, null);
    }
  } else {
    resSend(res, false, 200, "NGS don't exist", null, null);
  }
};

// GET /api/v1/master/fetchEmp
exports.fetchEmp = async (req, res) => {
  try {
    // let sql = `SELECT * FROM employee`;
    // const result = await query({
    //   query: sql,
    //   values: [],
    // });

    // for (let i = 0; i < result.length; i++) {
    //   console.log("hey i am result birthdayyyy:", result[i].birthday);
    // }
    // const currentDate = new Date();
    // console.log("Heyyyyyyyyyyyyyy i am current dateeee", currentDate);

    //     let sql2 = `SELECT *
    // FROM employee
    // WHERE DATE_FORMAT(birthday, '%Y-%m-%d') = '2024-03-20'
    //    OR DATE_FORMAT(anniversary, '%Y-%m-%d') ='2024-03-20';
    // `;
    // const currentDate = new Date().toISOString().split("T")[0];

    const currentDate = new Date();
    const currentMonth = (currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0"); // Month is zero-based (0 for January), padStart ensures two digits
    const currentDay = currentDate.getDate().toString().padStart(2, "0"); // padStart ensures two digits

    const currentMonthDay = `${currentMonth}-${currentDay}`;

    const sql2 = `
      SELECT * 
      FROM employee 
      WHERE 
        SUBSTRING(birthday, 6, 5) = '${currentMonthDay}'
        OR SUBSTRING(anniversary, 6, 5) = '${currentMonthDay}';
    `;

    const result2 = await query({
      query: sql2,
      values: [],
    });
    // console.log("heyyyyyyyyyyyyyyyyyyyy", result2);

    if (result2 && result2.length > 0) {
      // Records found
      resSend(res, true, 200, "Employee list", result2, null);
    } else {
      // No records found
      resSend(res, false, 200, "No Records Found!", result2, null);
    }
  } catch (error) {
    // Handle error
    console.log(error);
    resSend(res, false, 400, "Error", error, null);
  }
};

// GET /api/v1/master/fetchAlerts
exports.fetchAlerts = async (req, res) => {
  let { startTime, endTime } = req.body;
  if (startTime && endTime) {
    try {
      let sql = `SELECT * FROM alarm as t1
      INNER JOIN depts as t2 ON t1.dept_id = t2.dept_id
      WHERE datetime BETWEEN '${startTime}' AND '${endTime}'`;

      const result = await query({
        query: sql,
        values: [],
      });
      if (result && result.length > 0) {
        // User exits, check passwords
        resSend(res, true, 200, "Alarm list", result, null);
      } else {
        resSend(res, false, 200, "No Alarm Record Found!", result, null);
      }
    } catch (error) {
      console.log(error);
      resSend(res, false, 400, "Error", error, null);
    }
  } else {
    resSend(res, false, 200, "Send Start and end time", null, null);
  }
};

// POST /api/v1/master/emp/excel
exports.excelEmp = async (req, res) => {
  try {
    let workbook = xlsx.readFile("uploadexcel.xlsx");
    // console.log("Hey i am work book sheet", workbook.Sheets);
    // console.log("Hey i am work book sheet name", workbook.SheetNames[0]);

    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    // console.log("Hey i am worksheet....", workbook);

    let range = xlsx.utils.decode_range(worksheet["!ref"]);
    console.log("rangeeeeeeeeee", range);
    for (let row = range.s.r; row <= range.e.r; row++) {
      let data = [];
      for (let col = range.s.c; col <= range.e.c; col++) {
        let cell = worksheet[xlsx.utils.encode_cell({ r: row, c: col })];
        console.log("hey i am celll", cell);
        if (cell) {
          data.push(cell.v);
        } else {
          data.push("");
        }
      }
      console.log("Hey i am data...", data);
      let SQL = `INSERT INTO employee (NGS,name,birthday,anniversary,employee_email,senior_email,hr_email)
      VALUES(?,?,?,?,?,?,?)`;
      const result = await query({
        query: SQL,
        values: data,
      });
    }

    res.send("Success");
  } catch (error) {
    // Handle error
    console.log(error);
    res.status(400).send({ success: false, message: "Error", error: error });
  }
};

// GET /api/v1/master/mailsend
// exports.sendEmail = async (req, res) => {
//   try {
//     const { NGS } = req.body;
//     console.log("hey i am NGS....", NGS);
//     let sql = `SELECT * FROM employee where NGS = '${NGS}'`;
//     const result2 = await query({
//       query: sql,
//       values: [],
//     });

//     // if (result2 && result2.length > 0) {
//     //   // If employee with given NGS exists
//     //   await mailControllerindividual(result2[0]); // Pass the employee details to mailController function
//     //   res.send("MailController function called!");
//     // } else {
//     //   res.send("No employee found with provided NGS.");
//     // }

//     // mailController();
//     // res.send("mailController function calledhhhhhhhh!");

//     if (result2 && result2.length > 0) {
//       // If employee with given NGS exists
//       await mailControllerindividual(result2[0]); // Pass the employee details to mailController function
//       res.status(200).send({
//         statusCode: 200,
//         status: "success",
//         description: "Mail sent successfully!",
//       });
//     } else {
//       res.status(404).send({
//         statusCode: 404,
//         status: "failed",
//         description: "No employee found with provided NGS.",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     resSend(res, false, 400, "Error", error, null);
//   }
// };
// improved
exports.sendEmail = async (req, res) => {
  try {
    const { NGS, image, name, selectedEventType } = req.body;
    console.log("NGS:", NGS);
    console.log("Image:", image);
    console.log("Name:", name);
    console.log("selectedEventType", selectedEventType);
    let sql = `SELECT * FROM employee where NGS = '${NGS}'`;
    const result2 = await query({
      query: sql,
      values: [],
    });

    // if (result2 && result2.length > 0) {
    //   // If employee with given NGS exists
    //   await mailControllerindividual(result2[0]); // Pass the employee details to mailController function
    //   res.send("MailController function called!");
    // } else {
    //   res.send("No employee found with provided NGS.");
    // }

    // mailController();
    // res.send("mailController function calledhhhhhhhh!");

    if (result2 && result2.length > 0) {
      // If employee with given NGS exists
      await mailControllerindividual(
        result2[0],
        image,
        name,
        selectedEventType
      ); // Pass the employee details to mailController function
      res.status(200).send({
        statusCode: 200,
        status: "success",
        description: "Mail sent successfully!",
      });
    } else {
      res.status(404).send({
        statusCode: 404,
        status: "failed",
        description: "No employee found with provided NGS.",
      });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({
      statusCode: 500,
      status: "failed",
      description: "An error occurred while sending email.",
    });
  }
};

// POST/api/v1/master/mailsendcronjob

exports.sendEmailcronjob = async (req, res) => {
  try {
    const { flag } = req.body;
    console.log(flag);

    if (flag === "START") {
      // Start the cron job
      cronJobStart();
      res.send("Cron job started!");
    } else if (flag === "STOP") {
      // Stop the cron job if it's running
      cronJobStop();
      res.send("Cron job stopped!");
    } else {
      res.send("Invalid flag value. Use 'START' or 'STOP'.");
    }
  } catch (error) {
    console.log(error);
    resSend(res, false, 400, "Error", error, null);
  }
};
