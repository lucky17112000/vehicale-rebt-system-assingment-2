import { Pool } from "pg";
import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDb = async () => {
  await pool.query(`
    
    CREATE TABLE IF NOT EXISTS Users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    CHECK (email = LOWER(email)),
    password TEXT NOT NULL CHECK (char_length(password)>=6),
    phone varchar(20) NOT NULL,
    role varchar(20) NOT NULL CHECK (role IN ('admin' , 'customer')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    
    
    )`);
  await pool.query(`
      CREATE TABLE IF NOT EXISTS Vehicles(
     id SERIAL PRIMARY KEY,
     vehicle_name VARCHAR(100) NOT NULL,
     type VARCHAR(50) NOT NULL CHECK(type IN('car', 'bike', 'van', 'SUV')),
     registration_number VARCHAR(100) NOT NULL UNIQUE,
     daily_rent_price NUMERIC NOT NULL CHECK(daily_rent_price > 0),
     availability_status VARCHAR(20) NOT NULL CHECK(availability_status IN('available', 'booked')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
     
      )`);

  await pool.query(`
  CREATE TABLE IF NOT EXISTS Bookings (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES Users(id) ON DELETE CASCADE,
    vehicle_id INT REFERENCES Vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL,
    CHECK (rent_end_date > rent_start_date),
    total_price NUMERIC NOT NULL CHECK (total_price > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
    vehicle JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`);
};

export default initDb;
