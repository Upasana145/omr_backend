const mysql = require("mysql2/promise");

async function query({ query, values = [] }) {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    const [results] = await db.execute(query, values);
    await db.end();
    console.log("connected to database");
    return results;
  } catch (error) {
    return { error };
  }
}
module.exports = { query };
