import { pool } from "../../config/db";

const getAllusers = async () => {
  const result = await pool.query(`SELECT * FROM Users`);
  if (result.rows.length > 0) {
    result.rows.forEach((row) => {
      delete row.password;
      delete row.created_at;
      delete row.updated_at;
    });
  }
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
      `UPDATE Users SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        role = COALESCE($4, role)
      WHERE id=$5 RETURNING *`,
      [name, email, phone, role, id]
    );

    if (result.rows.length > 0) {
      delete result.rows[0].password;
      delete result.rows[0].created_at;
      delete result.rows[0].updated_at;
    }
    return result;
  } else if (
    loggedInUser.role === "customer" &&
    String(loggedInUser.id) === String(id)
  ) {
    const { name, email, phone } = payload;
    const result = await pool.query(
      `UPDATE Users SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone)
      WHERE id=$4 RETURNING *`,
      [name, email, phone, id]
    );
    if (result.rows.length > 0) {
      delete result.rows[0].password;
      delete result.rows[0].created_at;
      delete result.rows[0].updated_at;
    }
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
