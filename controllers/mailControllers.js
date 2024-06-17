const { query } = require("../db/db.js");
const HTML_TEMPLATE = require("../utils/mail-template.js");
const SENDMAIL = require("../utils/mailSend.js");

const fs = require("fs"); // Import the Node.js File System module
// modified one //this code is working but image is not getting send
// exports.mailControllerindividual = async (
//   employee_details,
//   imimage,
//   name,
//   selectedEventType
// ) => {
//   try {
//     console.log("Employee Details:", employee_details);
//     console.log("Image:", imimage);
//     console.log("Name:", name);
//     console.log("Selected Event Type:", selectedEventType);

//     const { NGS, employee_email, senior_email, hr_email } = employee_details;

//     console.log(
//       "NGS:",
//       NGS,
//       "Employee Email:",
//       employee_email,
//       "Senior Email:",
//       senior_email,
//       "HR Email:",
//       hr_email
//     );

//     const toEmails = `${employee_email},${senior_email},${hr_email}`;
//     console.log("To Emails:", toEmails);

//     // Save the image locally
//     const imagePath = `uploads/${name}_${selectedEventType}_${Date.now()}.jpg`;
//     fs.writeFileSync(imagePath, imimage.split(";base64,").pop(), "base64");
//     console.log("Image saved locally:", imagePath);

//     let mailDetails = {
//       from: "safety.sudisafoundry@gmail.com",
//       to: toEmails,
//       subject: "The staff is not wearing the safety helmet",
//       html: HTML_TEMPLATE(employee_details),
//       attachments: [
//         {
//           filename: `${name}_${selectedEventType}.jpg`,
//           path: imagePath,
//         },
//       ],
//     };

//     SENDMAIL(mailDetails, async function (data) {
//       const { accepted, rejected } = data;
//       console.log(`Accepted: ${accepted}`);
//       console.log(`Rejected: ${rejected}`);

//       let sql3 = `INSERT INTO mail_log (NGS,is_mail_trigger) VALUES ('${NGS}', 'yes')`;
//       const result3 = await query({
//         query: sql3,
//         values: [],
//       });
//       console.log("Inserted into mail log:", result3);
//     });
//   } catch (error) {
//     console.log("Error:", error);
//   }
// };

// old working code
exports.mailControllerindividual = async (
  employee_details,
  imimage,
  name,
  selectedEventType
) => {
  try {
    console.log("Employee Details:", employee_details);
    console.log("Image..........", imimage);
    console.log("Name.............", name);
    console.log("selectedEventType.............", selectedEventType);

    const { NGS, employee_email, senior_email, hr_email } = employee_details;

    console.log(
      "NGS:",
      NGS,
      "Employee Email:",
      employee_email,
      "Senior Email:",
      senior_email,
      "HR Email:",
      hr_email
    );

    const toEmails = `${employee_email},${senior_email},${hr_email}`;
    console.log("To Emails:", toEmails);

    let mailDetails = {
      from: "safety.sudisafoundry@gmail.com",
      to: toEmails,
      subject: "The staff is not wearing the safety helmet",
      html: HTML_TEMPLATE({ employee_details, selectedEventType, name }),
      attachments: [
        {
          path: `uploads/1711949627182-Happybirthday2.jpg`,

          // filename: "imimage.jpg",
          // content: imimage.split(";base64,").pop(), // Remove base64 prefix
          // encoding: "base64",
        },
      ],
    };

    SENDMAIL(mailDetails, async function (data) {
      const { accepted, rejected } = data;
      console.log(`Accepted: ${accepted}`);
      console.log(`Rejected: ${rejected}`);

      let sql3 = `INSERT INTO mail_log (NGS,is_mail_trigger) VALUES ('${NGS}', 'yes')`;
      const result3 = await query({
        query: sql3,
        values: [],
      });
      console.log("Inserted into mail log:", result3);
    });
  } catch (error) {
    console.log("Error:", error);
  }
};

// old working code
// exports.mailControllerindividual = async (employee_details) => {
//   try {
//     console.log("Employeeeee Detailss:", employee_details);
//     const { NGS, employee_email, senior_email, hr_email } = employee_details;

//     console.log("hey i am NGS", NGS, employee_email, senior_email, hr_email);

//     const toEmails = `${employee_email},${senior_email},${hr_email}`;
//     console.log("hey i am result...", toEmails);
//     let mailDetails = {
//       from: "safety.sudisafoundry@gmail.com",
//       // to: "upasanabharti145@gmail.com,upasanabharti146@gmail.com",
//       to: toEmails,
//       subject: "The staff is not wearing the safety helmet",
//       html: HTML_TEMPLATE(employee_details),
//     };

//     SENDMAIL(mailDetails, async function (data) {
//       const { accepted, rejected } = data;
//       console.log(`Accepted: ${accepted}`);
//       console.log(`Rejected: ${rejected}`);

//       let sql3 = `INSERT INTO mail_log (NGS,is_mail_trigger)VALUES('${NGS}',"yes")`;
//       const result3 = await query({
//         query: sql3,
//         values: [],
//       });
//       console.log("hello buddyyy..", result3);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.mailController = async () => {
  try {
    //   const currentDate = new Date().toISOString().split("T")[0];

    //   let sql = `SELECT * FROM employee WHERE DATE_FORMAT(birthday, '%Y-%m-%d') = '${currentDate}'
    //  OR DATE_FORMAT(anniversary, '%Y-%m-%d') = '${currentDate}'`;

    //   const result = await query({
    //     query: sql,
    //     values: [],
    //   });
    //   console.log("Hey i am result2......", result);

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

    const result = await query({
      query: sql2,
      values: [],
    });
    console.log("heyyyyyyyyyyyyyyyyyyyy i am resutl2222", result);

    if (result && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const {
          NGS,
          employee_email,
          senior_email,
          hr_email,
          name,
          birthday,
          anniversary,
        } = result[i];
        console.log(
          "hey i am NGS and other details",
          NGS,
          employee_email,
          senior_email,
          hr_email,
          name,
          birthday,
          anniversary
        );

        const today = new Date();
        const todayMonth = today.getMonth() + 1; // Months are zero-based
        const todayDay = today.getDate();

        console.log("todayyyyyyy", today, todayMonth, todayDay);
        const birthdayDate = new Date(birthday);
        const birthdayMonth = birthdayDate.getMonth() + 1;
        const birthdayDay = birthdayDate.getDate();
        console.log("birthdayyyyyyy", birthdayDate, birthdayMonth, birthdayDay);

        const anniversaryDate = new Date(anniversary);
        const anniversaryMonth = anniversaryDate.getMonth() + 1;
        const anniversaryDay = anniversaryDate.getDate();
        console.log(
          "anniversaryyy...",
          anniversaryDate,
          anniversaryMonth,
          anniversaryDay
        );

        let selectedEventType = "";

        if (todayMonth === birthdayMonth && todayDay === birthdayDay) {
          selectedEventType = "birthday";
        }

        if (todayMonth === anniversaryMonth && todayDay === anniversaryDay) {
          if (selectedEventType === "birthday") {
            selectedEventType = "anniversary and birthday";
          } else {
            selectedEventType = "anniversary";
          }
        }

        console.log("hey i am special dayyyyyyyyyy", selectedEventType);

        const toEmails = `${employee_email},${senior_email},${hr_email}`;
        console.log("hey i am result...", toEmails);

        console.log("toEmails", toEmails);
        let mailDetails = {
          from: "safety.sudisafoundry@gmail.com",
          // to: "upasanabharti145@gmail.com,upasanabharti146@gmail.com",
          to: toEmails,
          subject: "The staff is not wearing the safety helmet",
          html: HTML_TEMPLATE({ result, selectedEventType, name }),
          attachments: [
            {
              path: `uploads/1711949627182-Happybirthday2.jpg`,

              // filename: "imimage.jpg",
              // content: imimage.split(";base64,").pop(), // Remove base64 prefix
              // encoding: "base64",
            },
          ],
        };

        SENDMAIL(mailDetails, async function (data) {
          const { accepted, rejected } = data;
          console.log(`Accepted: ${accepted}`);
          console.log(`Rejected: ${rejected}`);

          let sql3 = `INSERT INTO mail_log (NGS,is_mail_trigger)VALUES('${NGS}',"yes")`;
          const result3 = await query({
            query: sql3,
            values: [],
          });
          console.log("hello buddyyy..", result3);

          // let sql3 = `update mail_log set is_sent = 1 where id = '${id}'`;
          // const result3 = await query({
          //   query: sql3,
          //   values: [],
          // });
          // let sql4 = `update mail_log set is_sent = 2 where is_sent = 0`;
          // const result4 = await query({
          //   query: sql4,
          //   values: [],
          // });
        });
      }
      // }
    }
  } catch (error) {
    console.log(error);
  }
};

// ******************************LAST UPDATE************************
// const { query } = require("../db/db.js");
// const HTML_TEMPLATE = require("../utils/mail-template.js");
// const SENDMAIL = require("../utils/mailSend.js");

// exports.mailController = async () => {
//   try {

//     let sql = `SELECT * FROM employee `;

//     const result = await query({
//       query: sql,
//       values: [],
//     });

//     if (result && result.length > 0) {
//       // for (let i = 0; i < result.length; i++) {
//       const { NGS, employee_email, senior_email, hr_email } = result[0];
//       console.log("hey i am NGS", NGS, employee_email, senior_email, hr_email);

//       const toEmails = `${employee_email},${senior_email},${hr_email}`;
//       console.log("hey i am result...", toEmails);

//       console.log("toEmails", toEmails);
//       let mailDetails = {
//         from: "safety.sudisafoundry@gmail.com",
//         // to: "upasanabharti145@gmail.com,upasanabharti146@gmail.com",
//         to: toEmails,
//         subject: "The staff is not wearing the safety helmet",
//         html: HTML_TEMPLATE(result[0]),
//       };

//       SENDMAIL(mailDetails, async function (data) {
//         const { accepted, rejected } = data;
//         console.log(`Accepted: ${accepted}`);
//         console.log(`Rejected: ${rejected}`);

//         let sql3 = `INSERT INTO mail_log (NGS,is_mail_trigger)VALUES('${NGS}',"yes")`;
//         const result3 = await query({
//           query: sql3,
//           values: [],
//         });
//         console.log("hello buddyyy..", result3);

//         // let sql3 = `update mail_log set is_sent = 1 where id = '${id}'`;
//         // const result3 = await query({
//         //   query: sql3,
//         //   values: [],
//         // });
//         // let sql4 = `update mail_log set is_sent = 2 where is_sent = 0`;
//         // const result4 = await query({
//         //   query: sql4,
//         //   values: [],
//         // });
//       });
//     }
//     // }
//   } catch (error) {
//     console.log(error);
//   }
// };

// ******************************LAST UPDATE************************
// exports.mailController = async () => {
//   try {
//     let sql = `SELECT * FROM mail_log WHERE is_sent = 0`;

//     const result = await query({
//       query: sql,
//       values: [],
//     });

//     // console.log("hey i am result....", result);

//     if (result && result.length > 0) {
//       const { id, body, is_sent, emails, datetime } = result[0];

//       console.log("hey i am result...", emails);
//       // mail send
//       let time = datetime.split("T")[1].slice(0, 5);
//       let date = new Date(datetime).toLocaleDateString("en", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//       //   const toEmails = Array.isArray(emails) ? emails.join(",") : emails;
//       const toEmails = emails.replace(/"/g, "");

//       console.log("toEmails", toEmails);
//       let mailDetails = {
//         from: "safety.sudisafoundry@gmail.com",
//         // to: "upasanabharti145@gmail.com,upasanabharti146@gmail.com",
//         to: toEmails,
//         subject: "The staff is not wearing the safety helmet",
//         html: HTML_TEMPLATE(JSON.parse(body), date, time),
//         attachments: [
//           {
//             filename: JSON.parse(body)?.image,
//             path: `uploads/${JSON.parse(body)?.image}`,
//           },
//         ],
//       };

//       SENDMAIL(mailDetails, async function (data) {
//         const { accepted, rejected } = data;
//         console.log(`Accepted: ${accepted}`);
//         console.log(`Rejected: ${rejected}`);

//         let sql3 = `update mail_log set is_sent = 1 where id = '${id}'`;
//         const result3 = await query({
//           query: sql3,
//           values: [],
//         });
//         let sql4 = `update mail_log set is_sent = 2 where is_sent = 0`;
//         const result4 = await query({
//           query: sql4,
//           values: [],
//         });
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// const { query } = require("../db/db.js");
// const HTML_TEMPLATE = require("../utils/mail-template.js");
// const SENDMAIL = require("../utils/mailSend.js");

// exports.mailController = async () => {
//   try {
//     let sql = `SELECT * FROM mail_log WHERE is_sent = 0`;

//     const result = await query({
//       query: sql,
//       values: [],
//     });

//     console.log("hey i am result....", result);

//     if (result && result.length > 0) {
//       //   console.log("hey i am result....", result);
//       //   console.log("hey i am result.length....", result.length);

//       //   const { body, is_sent, datetime } = result[0];
//       for (const item of result) {
//         const { body, is_sent, datetime } = item;
//         // sendEmail({ body, is_sent, datetime });
//       }
//       // mail send
//       let time = datetime.split("T")[1].slice(0, 5);
//       let date = new Date(datetime).toLocaleDateString("en", {
//         weekday: "long",
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//       let mailDetails = {
//         from: "safety.sudisafoundry@gmail.com",
//         to: "mrinmoygh081@gmail.com",
//         subject: "The staff is not wearing the safety helmet",
//         html: HTML_TEMPLATE(JSON.parse(body), date, time),
//         attachments: [
//           {
//             filename: JSON.parse(body)?.image,
//             path: `uploads/${JSON.parse(body)?.image}`,
//           },
//         ],
//       };
//       //   console.log(mailDetails);
//       // SENDMAIL(mailDetails, function (err, data) {
//       //   if (!err) {
//       //     console.log("Error Occurs", err);
//       //   } else {
//       //     console.log("Email sent successfully");
//       //   }
//       // });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
