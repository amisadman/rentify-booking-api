import { Request } from "express";
import { pool } from "../../database/db";
const createBooking = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(
    `
        SELECT id,vehicle_name,daily_rent_price,availability_status FROM vehicles WHERE id=$1
        
        `,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  const customerResult = await pool.query(
    `
        SELECT id FROM users WHERE id=$1
        
        `,
    [customer_id]
  );

  if (customerResult.rows.length === 0) {
    throw new Error("Customer not found");
  }

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const numberOfDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (numberOfDays <= 0) {
    throw new Error("End date must be after start date");
  }

  const total_price = Number(vehicle.daily_rent_price) * numberOfDays;

  const result = await pool.query(
    `
        INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) VALUES($1,$2,$3,$4,$5,'active') RETURNING id,customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status
        
        `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  await pool.query(
    `
        UPDATE vehicles SET availability_status='booked',updated_at=NOW() WHERE id=$1
        
        `,
    [vehicle_id]
  );

  return {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: Number(vehicle.daily_rent_price),
    },
  };
};

const updateBookingStatus = async (
  id: number,
  status: string,
  vehicleId: number
) => {
  const result = await pool.query(
    `
        UPDATE bookings SET status=$1,updated_at=NOW() WHERE id=$2 RETURNING id,customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status
        
        `,
    [status, id]
  );

  await pool.query(
    `
        UPDATE vehicles SET availability_status='available',updated_at=NOW() WHERE id=$1
        
        `,
    [vehicleId]
  );

  if (status === "returned") {
    return {
      ...result.rows[0],
      vehicle: {
        availability_status: "available",
      },
    };
  }

  return result.rows[0];
};
const getBookingById = async (id: number) => {
  const result = await pool.query(
    `
        SELECT id,customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status FROM bookings WHERE id=$1
        
        `,
    [id]
  );
  return result.rows[0];
};
export const bookingService = {
  createBooking,
  updateBookingStatus,
  getBookingById,
};
