import bcrypt from "bcryptjs";
import { sendResponse } from "../../utils/response";
import { config } from "../../config/config";
import { pool } from "../../database/db";


const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string, Number(config.salt));
  
  const result = await pool.query(`
    INSERT INTO users(name,email,password,phone,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,phone,role
    
    `,[name,email,hashedPass,phone,role]);

    return result;
};

export const authService = {
  signup,
};
