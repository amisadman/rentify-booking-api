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

const updateUser = async (id: number, payload: Record<string, unknown>) => {
  const existingUser = await pool.query(
    `SELECT name, email, phone, role FROM users WHERE id = $1`,
    [id]
  );

  if (existingUser.rows.length === 0) {
    return null;
  }

  const current = existingUser.rows[0];
  const name = payload.name ?? current.name;
  const email = payload.email ?? current.email;
  const phone = payload.phone ?? current.phone;
  const role = payload.role ?? current.role;

  const result = await pool.query(
    `
        UPDATE users SET name=$1,email=$2,phone=$3,role=$4,updated_at=NOW() WHERE id=$5 RETURNING id,name,email,phone,role
        
        `,
    [name, email, phone, role, id]
  );

  return result.rows[0];
};

const deleteUser = async (id: number) => {
  const activeBookings = await pool.query(
    `SELECT id FROM bookings WHERE customer_id = $1 AND status = 'active'`,
    [id]
  );

  if (activeBookings.rows.length > 0) {
    throw new Error("Cannot delete user with active bookings");
  }

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [id]
  );

  return result.rows[0];
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
