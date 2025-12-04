import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

const signUpService = async (payload: Record<string, any>) => {
  const { name, email, password, phone, role } = payload;
  const haeshedPassword = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `
    
    INSERT INTO Users(name , email , password , phone , role) VALUES($1 , $2 , $3 ,$4, $5) RETURNING *`,
    [name, email, haeshedPassword, phone, role]
  );

  delete result.rows[0].password;
  return result;
};

export const authServices = { signUpService };
