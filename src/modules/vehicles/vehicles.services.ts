import { pool } from "../../config/db";

const createVehicles = async (payload: Record<string, any>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `
    
    INSERT INTO Vehicles(vehicle_name, type , registration_number,daily_rent_price, availability_status) VALUES($1 , $2 , $3 , $4 , $5) RETURNING *`,
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
  const result = await pool.query(`SELECT * FROM Vehicles`);
  if (result.rows.length > 0) {
    result.rows.forEach(row => {
      delete row.created_at;
      delete row.updated_at;
    });
  }
  return result;
};

const singleVehicles = async (id: string) => {
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [id]);
  return result;
};

const updateVehicles = async (id: string, payload: Record<string, any>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `UPDATE Vehicles SET vehicle_name=$1, type=$2,registration_number=$3, daily_rent_price=$4,availability_status=$5, updated_at=NOW() WHERE id=$6 RETURNING *`,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );
  return result;
};

const deleteVehicles = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM Vehicles WHERE id=$1 RETURNING *`,
    [id]
  );
  return result;
};

export const vehiclesServices = {
  createVehicles,
  getAllVehicles,
  singleVehicles,
  updateVehicles,
  deleteVehicles,
};
