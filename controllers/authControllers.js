const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { resSend } = require("../utils/resSend");
const { query } = require("../db/db.js");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Login User
exports.loginHandler = async (req, res) => {
  const { username, password } = req.body;
  // console.log("hey i am username........", username, password);
  try {
    let sql = `SELECT username, password FROM auth WHERE username= '${username}' and isActive = 'y'`;

    const result = await query({
      query: sql,
      values: [],
    });
    // console.log("***********************", result.length);
    if (result && result.length > 0) {
      // User exits, check passwords
      const pwIsCorrect = await bcrypt.compare(password, result[0]?.password);
      if (pwIsCorrect) {
        const token = generateToken(username);
        resSend(res, true, 200, "Login Successful", result, token);
      } else {
        resSend(res, false, 200, "Password is invalid!jjjjj", result, null);
      }
    } else {
      resSend(res, false, 200, "USER ID is invalid!", result, null);
    }
  } catch (error) {
    console.log(error);
    resSend(res, false, 400, "Error", error, null);
  }
};
