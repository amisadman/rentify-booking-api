import { Pool } from "pg";
import { config } from "../config/config";

const pool = new Pool({
  connectionString: `${config.connection_string}`,
});
export const initDB = async () => {
  await pool.query(`

    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(40) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type VARCHAR(10) NOT NULL
        CHECK (type IN ('car', 'bike', 'van', 'SUV')),
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    daily_rent_price NUMERIC(10,2) NOT NULL
        CHECK (daily_rent_price > 0),
    availability_status VARCHAR(10) NOT NULL DEFAULT 'available'
        CHECK (availability_status IN ('available', 'booked')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    
    )`);

  await pool.query(`
  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
    status VARCHAR(10) NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'cancelled', 'returned')),
    CHECK (rent_end_date > rent_start_date),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`);

  console.log("Database Created!!!");
};
