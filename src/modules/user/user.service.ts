import { pool } from "../../database/db";

const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT id, name, email, phone, role FROM users
  `);
  return result.rows;
};

const getUserById = async (id: number) => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

export const userService = {
    getAllUsers,
    getUserById
}