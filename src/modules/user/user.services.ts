import { pool } from "../../config/db";

const getAllusers = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  delete result.rows[0].password;
  return result;
};

export const userServices = { getAllusers };
