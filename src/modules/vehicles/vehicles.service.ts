import { Request, Response } from "express";
import { pool } from "../../database/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `

        INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING vehicle_name,type,registration_number,daily_rent_price,availability_status
        
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

const getAllVehicles = async () => {
  const result = await pool.query(`
        SELECT id,vehicle_name,type,registration_number,daily_rent_price,availability_status FROM vehicles
        
        `);
  return result.rows;
};
const getVehiclesById = async (id: number) => {
  const result = await pool.query(
    `
        SELECT id,vehicle_name,type,registration_number,daily_rent_price,availability_status FROM vehicles WHERE id=$1
        
        `,
    [id]
  );
  return result.rows[0];
};

const updateVehicle = async (id: number, payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
        UPDATE vehicles SET vehicle_name=$1,type=$2,registration_number=$3,daily_rent_price=$4,availability_status=$5,updated_at=NOW() WHERE id=$6 RETURNING id,vehicle_name,type,registration_number,daily_rent_price,availability_status
        
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );

  return result.rows[0];
};
export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehiclesById,
  updateVehicle,
};
