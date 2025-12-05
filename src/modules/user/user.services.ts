import { pool } from "../../config/db";

const getAllusers = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  delete result.rows[0].password;
  return result;
};

const updteUser = async (
  payload: Record<string, any>,
  loggedInUser: Record<string, any>,
  id: string
) => {
  if (!payload) {
    throw new Error("Request body is required");
  }

  if (loggedInUser.role === "admin") {
    const { name, email, phone, role } = payload;
    const result = await pool.query(
      `UPDATE Users SET name=$1 , email=$2 , phone=$3 , role=$4 WHERE id=$5 RETURNING *`,
      [name, email, phone, role, id]
    );
    return result;
  } else if (
    loggedInUser.role === "customer" &&
    String(loggedInUser.id) === String(id)
  ) {
    const { name, email, phone } = payload;
    const result = await pool.query(
      `UPDATE Users SET name=$1 , email=$2 , phone=$3 WHERE id=$4 RETURNING *`,
      [name, email, phone, id]
    );
    return result;
  }

  return { rows: [] };
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM Users WHERE id=$1 RETURNING *`, [
    id,
  ]);
  return result;
};

export const userServices = { getAllusers, updteUser, deleteUser };
