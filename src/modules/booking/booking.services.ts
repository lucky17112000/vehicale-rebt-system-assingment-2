import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
  const result = await pool.query(`SELECT * FROM Vehicles WHERE id = $1`, [
    vehicle_id,
  ]);
  if (result.rows.length === 0) {
    throw new Error("Vehicle not found");
  }
  const vehicleTot = result.rows[0];
  if (vehicleTot.availability_status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const daily_cost = vehicleTot.daily_rent_price;

  // Calculate rent days debuging er smy test korte hobe
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const diffTime = endDate.getTime() - startDate.getTime();
  const rent_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const total_price = daily_cost * rent_days;
  const status = "active";

  const vehicle = {
    vehicle_name: vehicleTot.vehicle_name,
    daily_rent_price: vehicleTot.daily_rent_price,
  };

  const bookingWorkflow = await pool.query(
    `INSERT INTO Bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, vehicle) 
     VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
      //   vehicle
      JSON.stringify(vehicle),
    ]
  );

  //primari;ly eta alada koreci debuging er smy dekte hobe je akshate kora jay kina

  await pool.query(
    `UPDATE Vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return bookingWorkflow;
};

const getAllBookings = async (id: string, role: string) => {
  if (role === "admin") {
    const result = await pool.query(`SELECT * FROM Bookings`);
    return result;
  } else if (role === "customer") {
    const result = await pool.query(
      `SELECT * FROM Bookings WHERE customer_id = $1`,
      [id]
    );
    return result;
  }
  return [];
};

const bookingUpdate = async (
  bookingId: string,
  role: string,
  id: string,
  status: string
) => {
  if (status === "returned" && role === "admin") {
    const result = await pool.query(
      `UPDATE Bookings SET status='returned' WHERE id=$1 RETURNING *`,
      [bookingId]
    );
    if (result.rows.length > 0) {
      const vehicleId = result.rows[0].vehicle_id;
      const updateVehicle = await pool.query(
        `UPDATE Vehicles SET availability_status='available' WHERE id=$1 RETURNING *`,
        [vehicleId]
      );
      const vehicles = {
        availability_status: "available",
      };
      result.rows[0].vehicle = vehicles;
      delete result.rows[0].created_at;
      delete result.rows[0].updated_at;
      delete result.rows[0].vehicle;
      return {
        booking: result.rows[0],
      };
    }
    //ei jayga chek koiro
    return result;
  } else if (status === "cancelled") {
    //eijayga cheak korte hobe sevral condition die
    const findCustomer = await pool.query(
      `SELECT * FROM Bookings WHERE id=$1 AND customer_id=$2`,
      [bookingId, id]
    );
    if (findCustomer.rows.length === 0) {
      throw new Error("Booking not found for this customer");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rentStartDate = new Date(findCustomer.rows[0].rent_start_date);
    if (today >= rentStartDate) {
      throw new Error("Cannot cancel booking on or after rent start date");
    }
    const result = await pool.query(
      `UPDATE Bookings SET status='cancelled' WHERE id=$1 AND customer_id=$2 RETURNING *`,
      [bookingId, id]
    );
    console.log(result);

    const vehicleId = result.rows[0].vehicle_id;
    await pool.query(
      `UPDATE Vehicles SET availability_status='available' WHERE id=$1`,
      [vehicleId]
    );
    delete result.rows[0].created_at;
    delete result.rows[0].updated_at;
    delete result.rows[0].vehicle;
    return {
      booking: result.rows[0],
    };
  } else {
    //ekhane else na korle maybe besi valo hoto so debuging er somoy etao chk korte hobe
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiredBookings = await pool.query(
      `SELECT * FROM Bookings WHERE status = 'active' AND rent_end_date < $1`,
      [today]
    );
    if (expiredBookings.rows.length === 0) {
      return { rows: [] };
    }

    await pool.query(
      `UPDATE Bookings SET status = 'returned', updated_at = NOW() WHERE id = $1`,
      [expiredBookings.rows[0].id]
    );
    await pool.query(
      `UPDATE Vehicles SET availability_status = 'available' WHERE id = $1`,
      [expiredBookings.rows[0].vehicle_id]
    );
  }
};
export const bookingServices = { createBooking, getAllBookings, bookingUpdate };
