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

  //hisab
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const diffTime = endDate.getTime() - startDate.getTime();
  const rent_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const total_price = daily_cost * rent_days;
  const status = "active";

  const vehicle = {
    vehicle_name: vehicleTot.vehicle_name,
    daily_rent_price: vehicleTot.daily_rent_price,
    // registration_number: vehicleTot.registration_number,
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
  if (bookingWorkflow.rows.length > 0) {
    delete bookingWorkflow.rows[0].created_at;
    delete bookingWorkflow.rows[0].updated_at;
  }

  return bookingWorkflow;
};

const getAllBookings = async (id: string, role: string) => {
  if (role === "admin") {
    const result = await pool.query(`SELECT * FROM Bookings`);
    //cutomer id guloalda korci query chalate hobe karon user er email and name lagbe
    const customerIds = result.rows.map((booking) => booking.customer_id);
    const vehicleIds = result.rows.map((booking) => booking.vehicle_id);

    // Fetch customer data from Users table
    if (customerIds.length > 0) {
      // user theke sob data anlam ja ja lagbe by any query
      const customerResult = await pool.query(
        `SELECT id , name , email FROM Users WHERE id = ANY($1)`,
        [customerIds]
      );

      // Fetch vehicle data from Vehicles table
      const vehicleResult = await pool.query(
        `SELECT id, vehicle_name, registration_number, type FROM Vehicles WHERE id = ANY($1)`,
        [vehicleIds]
      );

      //look up table create korci jate easily access korte pari id die and comlexity komate pari
      const customerMap = customerResult.rows.reduce((acc, customer) => {
        acc[customer.id] = {
          name: customer.name,
          email: customer.email,
        };
        return acc;
      }, {} as Record<string, { name: string; email: string }>);

      // Create vehicle lookup map
      const vehicleMap = vehicleResult.rows.reduce((acc, vehicle) => {
        acc[vehicle.id] = {
          vehicle_name: vehicle.vehicle_name,
          registration_number: vehicle.registration_number,
          car_type: vehicle.car_type,
        };
        return acc;
      }, {} as Record<string, { vehicle_name: string; registration_number: string; car_type: string }>);

      // restructure kore nilam karon assingment erstructure anar jonno
      result.rows = result.rows.map((booking) => {
        const customer = customerMap[booking.customer_id] || null; //0(1) e acceess korte parlam easily
        const vehicleFromDb = vehicleMap[booking.vehicle_id] || null;
        const vehicle = {
          // ...booking.vehicle,
          ...vehicleFromDb,
        };

        // date formate T die split korte hobe bcz i need only date part
        const rent_start_date = booking.rent_start_date
          ? new Date(booking.rent_start_date).toISOString().split("T")[0]
          : booking.rent_start_date;
        const rent_end_date = booking.rent_end_date
          ? new Date(booking.rent_end_date).toISOString().split("T")[0]
          : booking.rent_end_date;

        const total_price = booking.total_price;
        const status = booking.status;

        // delete booking.customer_id;
        delete booking.vehicle;
        delete booking.created_at;
        delete booking.updated_at;
        delete booking.rent_start_date;
        delete booking.rent_end_date;
        delete booking.total_price;
        delete booking.status;

        return {
          ...booking,
          rent_start_date,
          rent_end_date,
          total_price,
          status,
          customer,
          vehicle,
        };
      });
    } else if (result.rows.length > 0) {
      result.rows.forEach((booking) => {
        delete booking.created_at;
        delete booking.updated_at;
      });
    }

    return result;
  } else if (role === "customer") {
    const result = await pool.query(
      `SELECT * FROM Bookings WHERE customer_id = $1`,
      [id]
    );

    const vehicleIds = result.rows.map((booking) => booking.vehicle_id);

    if (vehicleIds.length > 0) {
      // Fetch customer data
      const customerResult = await pool.query(
        `SELECT id, name, email FROM Users WHERE id = $1`,
        [id]
      );

      const customer =
        customerResult.rows.length > 0
          ? {
              name: customerResult.rows[0].name,
              email: customerResult.rows[0].email,
            }
          : null;

      // Fetch vehicle data from Vehicles table
      const vehicleResult = await pool.query(
        `SELECT id, vehicle_name, registration_number, type FROM Vehicles WHERE id = ANY($1)`,
        [vehicleIds]
      );

      // Create vehicle lookup map
      const vehicleMap = vehicleResult.rows.reduce((acc, vehicle) => {
        acc[vehicle.id] = {
          vehicle_name: vehicle.vehicle_name,
          registration_number: vehicle.registration_number,
          type: vehicle.type,
        };
        return acc;
      }, {} as Record<string, { vehicle_name: string; registration_number: string; type: string }>);

      result.rows = result.rows.map((booking) => {
        const rent_start_date = booking.rent_start_date
          ? new Date(booking.rent_start_date).toISOString().split("T")[0]
          : booking.rent_start_date;
        const rent_end_date = booking.rent_end_date
          ? new Date(booking.rent_end_date).toISOString().split("T")[0]
          : booking.rent_end_date;

        const vehicleFromDb = vehicleMap[booking.vehicle_id] || null;
        const vehicle = {
          ...vehicleFromDb,
        };
        const total_price = booking.total_price;
        const status = booking.status;

        // delete booking.customer_id;
        delete booking.vehicle_id;
        delete booking.created_at;
        delete booking.updated_at;
        delete booking.rent_start_date;
        delete booking.rent_end_date;
        delete booking.vehicle;
        delete booking.total_price;
        delete booking.status;

        return {
          ...booking,
          rent_start_date,
          rent_end_date,
          total_price,
          status,
          // customer,
          vehicle,
        };
      });
    } else if (result.rows.length > 0) {
      result.rows.forEach((booking) => {
        delete booking.created_at;
        delete booking.updated_at;
      });
    }

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
  if (status === "returned") {
    // First check if booking exists ache ki na
    const checkBooking = await pool.query(
      `SELECT * FROM Bookings WHERE id=$1`,
      [bookingId]
    );

    if (checkBooking.rows.length === 0) {
      throw new Error("Booking not found");
    }

    if (checkBooking.rows[0].status === "returned") {
      throw new Error("Booking is already returned");
    }

    // Update booking status after returnedomng
    const result = await pool.query(
      `UPDATE Bookings SET status='returned' WHERE id=$1 RETURNING *`,
      [bookingId]
    );

    if (result.rows.length > 0) {
      const vehicleId = result.rows[0].vehicle_id;

      // Update vehicle availability karon vehicle now free
      await pool.query(
        `UPDATE Vehicles SET availability_status='available' WHERE id=$1`,
        [vehicleId]
      );

      const booking = result.rows[0];

      return {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date
          ? new Date(booking.rent_start_date).toISOString().split("T")[0]
          : booking.rent_start_date,
        rent_end_date: booking.rent_end_date
          ? new Date(booking.rent_end_date).toISOString().split("T")[0]
          : booking.rent_end_date,
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
          availability_status: "available",
        },
      };
    }

    throw new Error("Failed to update booking");
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

    const vehicleId = result.rows[0].vehicle_id;
    await pool.query(
      `UPDATE Vehicles SET availability_status='available' WHERE id=$1`,
      [vehicleId]
    );

    const booking = result.rows[0];

    return {
      id: booking.id,
      customer_id: booking.customer_id,
      vehicle_id: booking.vehicle_id,
      rent_start_date: booking.rent_start_date
        ? new Date(booking.rent_start_date).toISOString().split("T")[0]
        : booking.rent_start_date,
      rent_end_date: booking.rent_end_date
        ? new Date(booking.rent_end_date).toISOString().split("T")[0]
        : booking.rent_end_date,
      total_price: booking.total_price,
      status: booking.status,
    };
  }
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
};
export const bookingServices = { createBooking, getAllBookings, bookingUpdate };
