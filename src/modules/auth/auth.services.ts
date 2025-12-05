import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

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

const loginService = async (payload: Record<string, any>) => {
  const { email, password } = payload;
  //chk koro database e email ase ki na
  const result = await pool.query(`SELECT *FROM Users WHERE email=$1`, [email]);
  if (result.rows.length === 0) {
    throw new Error("Invalid email");
  }
  const user = result.rows[0];
  //ebar email jehetu correct tai its time to check password
  const match = await bcrypt.compare(password as string, user.password);
  if (!match) {
    throw new Error("Invalid Password");
  }
  // passowrd tik ache token generate korte hobe
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  console.log("Generated Token:", token);
  return { token, user };
};

export const authServices = { signUpService, loginService };
