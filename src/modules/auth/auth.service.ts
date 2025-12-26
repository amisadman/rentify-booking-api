import bcrypt from "bcryptjs";
import { sendResponse } from "../../utils/response";
import { config } from "../../config/config";
import { pool } from "../../database/db";
import jwt from "jsonwebtoken";

const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string, Number(config.salt));

  const result = await pool.query(
    `
    INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role
    
    `,
    [name, email, hashedPass, phone, role]
  );

  return result;
};

const signin = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;
  const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password as string, user.password);

  if (!match) {
    return false;
  }

  const jwt_secret = `${config.jwt_secret}`;

  const token = jwt.sign(
    {id:user.id ,name: user.name, email: user.email, role: user.role },
    jwt_secret,
    {
      expiresIn: "7d",
    }
  );

  delete user.password;
  delete user.created_at;
  delete user.updated_at;

  return { token, user };
};

export const authService = {
  signup,
  signin,
};
